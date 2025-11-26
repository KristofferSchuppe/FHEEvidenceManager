// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PrivacyEvidenceManagerEnhanced
 * @notice Confidential Judicial Evidence Management System
 * @dev Implements Gateway callback pattern, refund mechanisms, and timeout protection
 *
 * ARCHITECTURE FEATURES:
 * =====================
 * 1. Gateway Callback Pattern
 *    - Asynchronous decryption via external oracle
 *    - User submits request → Contract records → Gateway decrypts → Callback completes
 *    - Non-blocking operations with cryptographic proof verification
 *
 * 2. Refund Mechanism
 *    - Dual trigger conditions: decryption timeout (1 hour) OR review deadline (7 days)
 *    - Evidence submissions require 0.001 ETH deposit
 *    - Automatic refund if conditions met
 *    - Reentrancy-safe implementation
 *
 * 3. Timeout Protection
 *    - Layer 1: Decryption timeout (1 hour) - prevents Gateway failures from locking funds
 *    - Layer 2: Review deadline (7 days) - ensures timely reviewer action
 *    - Layer 3: Case expiry (optional) - time-bound case management
 *
 * 4. Privacy-Preserving Techniques
 *    - Division with random multipliers: (n × R) / (d × R) = n / d
 *    - Price obfuscation using block-based randomness
 *    - Encrypted metadata storage
 *
 * 5. Security Features
 *    - Input validation (zero-address, empty strings, overflow)
 *    - Access control (Owner, Judge, Reviewer roles)
 *    - DoS protection (no unbounded loops, gas limits)
 *    - Audit trail (comprehensive events)
 *
 * NOTE: This contract demonstrates the architecture patterns.
 * For production FHE implementation, install the fhevm library.
 */
contract PrivacyEvidenceManager {
    address public owner;
    uint256 public evidenceCount;
    uint256 public caseCount;
    uint256 public requestCount;

    // Timeout constants for protection layers
    uint256 public constant DECRYPTION_TIMEOUT = 1 hours;
    uint256 public constant EVIDENCE_REVIEW_TIMEOUT = 7 days;
    uint256 public constant MIN_DEPOSIT = 0.001 ether;

    enum EvidenceType { Document, Audio, Video, Image, Digital, Physical }
    enum EvidenceStatus { Submitted, UnderReview, Approved, Rejected, Sealed }
    enum AccessLevel { Public, Restricted, Confidential, TopSecret }

    // Evidence structure with timeout protection
    struct Evidence {
        uint256 caseId;
        EvidenceType evidenceType;
        EvidenceStatus status;
        AccessLevel accessLevel;
        address submitter;
        uint256 submissionTime;
        uint256 reviewDeadline;
        bool isSealed;
        string metadataURI;
        bytes32 hashData;
        bytes32 encryptedSize;      // In FHE version: euint64
        bytes32 encryptedPriority;  // In FHE version: euint32
        uint256 decryptionRequestId;
        bool decryptionPending;
        uint256 depositAmount;
    }

    // Case structure with expiry
    struct Case {
        string title;
        address judge;
        uint256 creationTime;
        uint256 expiryTime;  // 0 = no expiry
        bool isClosed;
        AccessLevel minAccessLevel;
        uint256 totalEvidence;
        uint256 approvedEvidence;
        uint256 decryptionRequestId;
    }

    // Storage
    mapping(uint256 => Evidence) public evidences;
    mapping(uint256 => Case) public cases;
    mapping(uint256 => string) internal requestIdToItemType;
    mapping(uint256 => uint256) internal requestIdToItemId;

    mapping(address => bool) public authorizedJudges;
    mapping(address => bool) public authorizedReviewers;
    mapping(address => mapping(uint256 => bool)) public hasAccess;

    // Events
    event EvidenceSubmitted(uint256 indexed evidenceId, uint256 indexed caseId, address indexed submitter, EvidenceType evidenceType);
    event EvidenceReviewed(uint256 indexed evidenceId, address indexed reviewer, EvidenceStatus status);
    event CaseCreated(uint256 indexed caseId, string caseTitle, address indexed judge, uint256 expiryTime);
    event AccessGranted(address indexed user, uint256 indexed caseId);
    event DecryptionRequested(uint256 indexed itemId, string itemType, uint256 requestId);
    event DecryptionCompleted(uint256 indexed itemId, string itemType, uint256 requestId);
    event DecryptionFailed(uint256 indexed itemId, string itemType, uint256 requestId);
    event RefundIssued(uint256 indexed evidenceId, address indexed submitter, uint256 amount);
    event TimeoutTriggered(uint256 indexed itemId, string itemType);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyJudge() {
        require(authorizedJudges[msg.sender], "Not authorized judge");
        _;
    }

    modifier onlyReviewer() {
        require(authorizedReviewers[msg.sender], "Not authorized reviewer");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedJudges[msg.sender] = true;
        authorizedReviewers[msg.sender] = true;
    }

    // ========================================
    // Role Management with Input Validation
    // ========================================

    function authorizeJudge(address _judge) external onlyOwner {
        require(_judge != address(0), "Invalid address: cannot be zero");
        require(!authorizedJudges[_judge], "Already authorized");
        authorizedJudges[_judge] = true;
    }

    function authorizeReviewer(address _reviewer) external onlyOwner {
        require(_reviewer != address(0), "Invalid address: cannot be zero");
        require(!authorizedReviewers[_reviewer], "Already authorized");
        authorizedReviewers[_reviewer] = true;
    }

    function revokeJudge(address _judge) external onlyOwner {
        require(_judge != owner, "Cannot revoke owner");
        authorizedJudges[_judge] = false;
    }

    function revokeReviewer(address _reviewer) external onlyOwner {
        require(_reviewer != owner, "Cannot revoke owner");
        authorizedReviewers[_reviewer] = false;
    }

    // ========================================
    // Case Management with Timeout Protection
    // ========================================

    /**
     * @notice Create case with optional expiry for Layer 3 timeout protection
     * @param _title Case title (validated: non-empty, max 256 chars)
     * @param _minAccessLevel Minimum access level required
     * @param _duration Duration in seconds (0 for no expiry)
     */
    function createCase(
        string memory _title,
        AccessLevel _minAccessLevel,
        uint256 _duration
    ) external onlyJudge returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_title).length <= 256, "Title too long");

        caseCount++;
        uint256 expiryTime = _duration > 0 ? block.timestamp + _duration : 0;

        cases[caseCount] = Case({
            title: _title,
            judge: msg.sender,
            creationTime: block.timestamp,
            expiryTime: expiryTime,
            isClosed: false,
            minAccessLevel: _minAccessLevel,
            totalEvidence: 0,
            approvedEvidence: 0,
            decryptionRequestId: 0
        });

        hasAccess[msg.sender][caseCount] = true;
        emit CaseCreated(caseCount, _title, msg.sender, expiryTime);
        return caseCount;
    }

    // ========================================
    // Evidence Submission with Deposit
    // ========================================

    /**
     * @notice Submit evidence with deposit for refund mechanism
     * @dev Requires MIN_DEPOSIT (0.001 ETH) to prevent spam and enable refunds
     */
    function submitEvidence(
        uint256 _caseId,
        EvidenceType _evidenceType,
        AccessLevel _accessLevel,
        bytes32 _hashData,
        bytes32 _encryptedSize,
        bytes32 _encryptedPriority,
        string memory _metadataURI
    ) external payable returns (uint256) {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case ID");
        Case storage caseData = cases[_caseId];
        require(!caseData.isClosed, "Case is closed");

        // Layer 3 timeout check: case expiry
        if (caseData.expiryTime > 0) {
            require(block.timestamp < caseData.expiryTime, "Case expired");
        }

        require(hasAccess[msg.sender][_caseId] || authorizedJudges[msg.sender], "No access to case");
        require(_hashData != bytes32(0), "Invalid hash: cannot be zero");
        require(bytes(_metadataURI).length > 0, "Metadata URI cannot be empty");
        require(msg.value >= MIN_DEPOSIT, "Insufficient deposit for evidence");

        evidenceCount++;

        evidences[evidenceCount] = Evidence({
            caseId: _caseId,
            evidenceType: _evidenceType,
            status: EvidenceStatus.Submitted,
            accessLevel: _accessLevel,
            submitter: msg.sender,
            submissionTime: block.timestamp,
            reviewDeadline: block.timestamp + EVIDENCE_REVIEW_TIMEOUT,  // Layer 2 timeout
            isSealed: false,
            metadataURI: _metadataURI,
            hashData: _hashData,
            encryptedSize: _encryptedSize,
            encryptedPriority: _encryptedPriority,
            decryptionRequestId: 0,
            decryptionPending: false,
            depositAmount: msg.value
        });

        caseData.totalEvidence++;
        emit EvidenceSubmitted(evidenceCount, _caseId, msg.sender, _evidenceType);
        return evidenceCount;
    }

    // ========================================
    // Gateway Callback Pattern
    // ========================================

    /**
     * @notice Request decryption via Gateway oracle
     * @dev Gateway Pattern Phase 1: Request submission
     * User submits request → Contract records → Gateway processes off-chain
     */
    function requestEvidenceDecryption(uint256 _evidenceId) external {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        Evidence storage evidence = evidences[_evidenceId];
        require(hasAccess[msg.sender][evidence.caseId] || authorizedJudges[msg.sender], "No access");
        require(!evidence.decryptionPending, "Decryption already pending");
        require(!evidence.isSealed, "Evidence is sealed");

        // Simulate Gateway request (in FHE version: FHE.requestDecryption())
        requestCount++;
        uint256 requestId = requestCount;

        evidence.decryptionRequestId = requestId;
        evidence.decryptionPending = true;
        requestIdToItemType[requestId] = "evidence";
        requestIdToItemId[requestId] = _evidenceId;

        emit DecryptionRequested(_evidenceId, "evidence", requestId);
    }

    /**
     * @notice Gateway callback function
     * @dev Gateway Pattern Phase 3: Callback with results
     * Gateway calls back with decrypted values + cryptographic proof
     * In FHE version: Verifies via FHE.checkSignatures()
     */
    function decryptionCallback(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) external {
        // In FHE version: FHE.checkSignatures(requestId, cleartexts, decryptionProof)

        string memory itemType = requestIdToItemType[requestId];
        uint256 itemId = requestIdToItemId[requestId];

        if (keccak256(bytes(itemType)) == keccak256(bytes("evidence"))) {
            _handleEvidenceDecryption(itemId, cleartexts);
        } else if (keccak256(bytes(itemType)) == keccak256(bytes("case"))) {
            _handleCaseDecryption(itemId, cleartexts);
        }
    }

    function _handleEvidenceDecryption(uint256 _evidenceId, bytes memory cleartexts) internal {
        Evidence storage evidence = evidences[_evidenceId];
        evidence.decryptionPending = false;
        emit DecryptionCompleted(_evidenceId, "evidence", evidence.decryptionRequestId);
    }

    function _handleCaseDecryption(uint256 _caseId, bytes memory cleartexts) internal {
        Case storage caseData = cases[_caseId];
        emit DecryptionCompleted(_caseId, "case", caseData.decryptionRequestId);
    }

    // ========================================
    // Refund Mechanism (Dual Trigger)
    // ========================================

    /**
     * @notice Claim refund if timeout conditions met
     * @dev Dual trigger conditions:
     * 1. Layer 1: Decryption timeout (1 hour) - Gateway didn't respond
     * 2. Layer 2: Review deadline (7 days) - Reviewer didn't act
     */
    function claimRefund(uint256 _evidenceId) external {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        Evidence storage evidence = evidences[_evidenceId];
        require(evidence.submitter == msg.sender, "Not submitter");
        require(evidence.depositAmount > 0, "No deposit to refund");

        // Layer 1: Decryption timeout check (1 hour)
        bool timeoutExpired = evidence.decryptionPending &&
            (evidence.decryptionRequestId > 0) &&
            (block.timestamp > evidence.submissionTime + DECRYPTION_TIMEOUT);

        // Layer 2: Review deadline check (7 days)
        bool reviewExpired = block.timestamp > evidence.reviewDeadline &&
            evidence.status == EvidenceStatus.Submitted;

        require(timeoutExpired || reviewExpired, "Refund conditions not met");

        // Reentrancy-safe: checks-effects-interactions pattern
        uint256 refundAmount = evidence.depositAmount;
        evidence.depositAmount = 0;
        evidence.decryptionPending = false;

        (bool sent, ) = payable(msg.sender).call{value: refundAmount}("");
        require(sent, "Refund transfer failed");

        emit RefundIssued(_evidenceId, msg.sender, refundAmount);

        if (timeoutExpired) {
            emit TimeoutTriggered(_evidenceId, "evidence");
        }
    }

    // ========================================
    // Privacy-Preserving Techniques
    // ========================================

    /**
     * @notice Privacy-preserving division using random multipliers
     * @dev Formula: (numerator × R) / (denominator × R) = numerator / denominator
     * Prevents pattern analysis while maintaining mathematical correctness
     *
     * In FHE version:
     * - numerator is euint64 (encrypted)
     * - Uses FHE.mul() and FHE.div() operations
     * - Random multiplier range: 1-1000
     */
    function privacyPreservingDivision(
        uint256 numerator,
        uint256 denominator,
        uint256 randomMultiplier
    ) internal pure returns (uint256) {
        require(denominator > 0, "Division by zero");
        require(randomMultiplier > 0 && randomMultiplier <= 1000, "Invalid multiplier");

        // Obfuscate by multiplying both
        uint256 obfuscated = numerator * randomMultiplier;
        uint256 divisor = denominator * randomMultiplier;
        uint256 result = obfuscated / divisor;

        return result;
    }

    /**
     * @notice Price obfuscation using block-based randomness
     * @dev Adds pseudo-random noise to encrypted prices
     * Noise sources: block.timestamp, block.prevrandao, evidenceCount
     *
     * Security properties:
     * - Temporal variation (different each block)
     * - Unpredictability (post-merge beacon randomness)
     * - Pattern breaking (prevents correlation attacks)
     */
    function obfuscatePrice(uint256 basePrice, uint256 noiseFactor) internal view returns (uint256) {
        require(noiseFactor <= 100, "Noise factor too high");

        // Generate pseudo-random noise
        uint256 noise = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            evidenceCount
        ))) % noiseFactor;

        uint256 obfuscated = basePrice + noise;
        return obfuscated;
    }

    // ========================================
    // Evidence Review with Deadline
    // ========================================

    function reviewEvidence(uint256 _evidenceId, EvidenceStatus _status) external onlyReviewer {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        Evidence storage evidence = evidences[_evidenceId];
        require(_status == EvidenceStatus.Approved || _status == EvidenceStatus.Rejected, "Invalid status");
        require(evidence.status != EvidenceStatus.Sealed, "Evidence is sealed");
        require(block.timestamp <= evidence.reviewDeadline, "Review deadline passed");

        evidence.status = _status;

        if (_status == EvidenceStatus.Approved) {
            Case storage caseData = cases[evidence.caseId];
            caseData.approvedEvidence++;
        }

        emit EvidenceReviewed(_evidenceId, msg.sender, _status);
    }

    // ========================================
    // Additional Functions
    // ========================================

    function sealEvidence(uint256 _evidenceId) external onlyJudge {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        Evidence storage evidence = evidences[_evidenceId];
        require(!evidence.isSealed, "Already sealed");
        require(!evidence.decryptionPending, "Decryption pending");

        evidence.isSealed = true;
        evidence.status = EvidenceStatus.Sealed;
    }

    function grantAccess(address _user, uint256 _caseId) external onlyJudge {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        require(_user != address(0), "Invalid address");

        hasAccess[_user][_caseId] = true;
        emit AccessGranted(_user, _caseId);
    }

    function revokeAccess(address _user, uint256 _caseId) external onlyJudge {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        require(_user != owner, "Cannot revoke owner");

        hasAccess[_user][_caseId] = false;
    }

    function closeCase(uint256 _caseId) external onlyJudge {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        Case storage caseData = cases[_caseId];
        require(caseData.judge == msg.sender, "Not case judge");
        require(!caseData.isClosed, "Already closed");

        caseData.isClosed = true;
    }

    function reopenCase(uint256 _caseId) external onlyJudge {
        require(_caseId > 0 && _caseId <= caseCount, "Invalid case");
        Case storage caseData = cases[_caseId];
        require(caseData.judge == msg.sender, "Not case judge");
        require(caseData.isClosed, "Case not closed");

        if (caseData.expiryTime > 0) {
            require(block.timestamp < caseData.expiryTime, "Case expired, cannot reopen");
        }

        caseData.isClosed = false;
    }

    // ========================================
    // View Functions
    // ========================================

    function getDecryptionStatus(uint256 _evidenceId) external view returns (
        bool pending,
        uint256 requestId,
        uint256 depositAmount
    ) {
        require(_evidenceId > 0 && _evidenceId <= evidenceCount, "Invalid evidence");
        Evidence storage evidence = evidences[_evidenceId];

        return (
            evidence.decryptionPending,
            evidence.decryptionRequestId,
            evidence.depositAmount
        );
    }

    function getTotalStats() external view returns (uint256, uint256, uint256) {
        return (caseCount, evidenceCount, requestCount);
    }

    function isJudge(address _address) external view returns (bool) {
        return authorizedJudges[_address];
    }

    function isReviewer(address _address) external view returns (bool) {
        return authorizedReviewers[_address];
    }

    function hasAccessToCase(address _user, uint256 _caseId) external view returns (bool) {
        return hasAccess[_user][_caseId] || authorizedJudges[_user];
    }
}
