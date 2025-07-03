// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title USDCPaymentScheduler
 * @dev Smart contract for scheduling recurring USDC payments across multiple chains
 */
contract USDCPaymentScheduler is ReentrancyGuard, Ownable {
    IERC20 public immutable usdcToken;
    
    struct Payment {
        uint256 id;
        address payer;
        address recipient;
        uint256 amount;
        uint256 interval; // in seconds
        uint256 startTime;
        uint256 lastExecuted;
        bool isActive;
        string description;
    }
    
    mapping(uint256 => Payment) public payments;
    mapping(address => uint256[]) public userPayments;
    uint256 public nextPaymentId;
    
    event PaymentScheduled(
        uint256 indexed paymentId,
        address indexed payer,
        address indexed recipient,
        uint256 amount,
        uint256 interval,
        uint256 startTime
    );
    
    event PaymentExecuted(
        uint256 indexed paymentId,
        address indexed payer,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );
    
    event PaymentCancelled(uint256 indexed paymentId);
    
    constructor(address _usdcToken) {
        require(_usdcToken != address(0), "Invalid USDC token address");
        usdcToken = IERC20(_usdcToken);
    }
    
    /**
     * @dev Schedule a new recurring payment
     */
    function schedulePayment(
        address _recipient,
        uint256 _amount,
        uint256 _interval,
        uint256 _startTime,
        string memory _description
    ) external returns (uint256) {
        require(_recipient != address(0), "Invalid recipient address");
        require(_amount > 0, "Amount must be greater than 0");
        require(_interval > 0, "Interval must be greater than 0");
        require(_startTime >= block.timestamp, "Start time must be in the future");
        
        uint256 paymentId = nextPaymentId++;
        
        payments[paymentId] = Payment({
            id: paymentId,
            payer: msg.sender,
            recipient: _recipient,
            amount: _amount,
            interval: _interval,
            startTime: _startTime,
            lastExecuted: 0,
            isActive: true,
            description: _description
        });
        
        userPayments[msg.sender].push(paymentId);
        
        emit PaymentScheduled(paymentId, msg.sender, _recipient, _amount, _interval, _startTime);
        
        return paymentId;
    }
    
    /**
     * @dev Execute a scheduled payment
     */
    function executePayment(uint256 _paymentId) external nonReentrant {
        Payment storage payment = payments[_paymentId];
        
        require(payment.isActive, "Payment is not active");
        require(block.timestamp >= payment.startTime, "Payment not yet due");
        require(
            payment.lastExecuted == 0 || 
            block.timestamp >= payment.lastExecuted + payment.interval,
            "Payment interval not met"
        );
        
        // Check if payer has sufficient USDC balance
        require(
            usdcToken.balanceOf(payment.payer) >= payment.amount,
            "Insufficient USDC balance"
        );
        
        // Check if contract has sufficient allowance
        require(
            usdcToken.allowance(payment.payer, address(this)) >= payment.amount,
            "Insufficient USDC allowance"
        );
        
        // Execute the transfer
        require(
            usdcToken.transferFrom(payment.payer, payment.recipient, payment.amount),
            "USDC transfer failed"
        );
        
        payment.lastExecuted = block.timestamp;
        
        emit PaymentExecuted(_paymentId, payment.payer, payment.recipient, payment.amount, block.timestamp);
    }
    
    /**
     * @dev Cancel a scheduled payment
     */
    function cancelPayment(uint256 _paymentId) external {
        Payment storage payment = payments[_paymentId];
        
        require(payment.payer == msg.sender, "Only payer can cancel payment");
        require(payment.isActive, "Payment is already inactive");
        
        payment.isActive = false;
        
        emit PaymentCancelled(_paymentId);
    }
    
    /**
     * @dev Check if a payment is due for execution
     */
    function isPaymentDue(uint256 _paymentId) external view returns (bool) {
        Payment storage payment = payments[_paymentId];
        
        if (!payment.isActive) return false;
        if (block.timestamp < payment.startTime) return false;
        if (payment.lastExecuted == 0) return true;
        
        return block.timestamp >= payment.lastExecuted + payment.interval;
    }
    
    /**
     * @dev Get payment details
     */
    function getPayment(uint256 _paymentId) external view returns (Payment memory) {
        return payments[_paymentId];
    }
    
    /**
     * @dev Get all payment IDs for a user
     */
    function getUserPayments(address _user) external view returns (uint256[] memory) {
        return userPayments[_user];
    }
    
    /**
     * @dev Get the next execution time for a payment
     */
    function getNextExecutionTime(uint256 _paymentId) external view returns (uint256) {
        Payment storage payment = payments[_paymentId];
        
        if (!payment.isActive) return 0;
        if (payment.lastExecuted == 0) return payment.startTime;
        
        return payment.lastExecuted + payment.interval;
    }
}
