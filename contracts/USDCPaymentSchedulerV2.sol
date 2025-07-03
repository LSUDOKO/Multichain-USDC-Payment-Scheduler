// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

/**
 * @title USDCPaymentSchedulerV2
 * @dev Enhanced smart contract for scheduling recurring USDC payments with Chainlink Automation
 */
contract USDCPaymentSchedulerV2 is ReentrancyGuard, Ownable, AutomationCompatibleInterface {
    IERC20 public immutable usdcToken;
    
    struct Payment {
        uint256 id;
        address payer;
        address recipient;
        uint256 amount;
        uint256 interval; // in seconds
        uint256 startTime;
        uint256 lastExecuted;
        uint256 nextExecution;
        bool isActive;
        string description;
    }
    
    mapping(uint256 => Payment) public payments;
    mapping(address => uint256[]) public userPayments;
    uint256 public nextPaymentId;
    
    // Chainlink Automation
    uint256 public constant UPKEEP_GAS_LIMIT = 500000;
    
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
        nextPaymentId = 1;
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
            nextExecution: _startTime,
            isActive: true,
            description: _description
        });
        
        userPayments[msg.sender].push(paymentId);
        
        emit PaymentScheduled(paymentId, msg.sender, _recipient, _amount, _interval, _startTime);
        
        return paymentId;
    }
    
    /**
     * @dev Execute a scheduled payment (manual execution)
     */
    function executePayment(uint256 _paymentId) external nonReentrant {
        Payment storage payment = payments[_paymentId];
        
        require(payment.isActive, "Payment is not active");
        require(block.timestamp >= payment.nextExecution, "Payment not yet due");
        require(payment.payer == msg.sender, "Only payer can execute manually");
        
        _executePaymentInternal(_paymentId);
    }
    
    /**
     * @dev Internal function to execute payment
     */
    function _executePaymentInternal(uint256 _paymentId) internal {
        Payment storage payment = payments[_paymentId];
        
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
        
        // Update payment schedule
        payment.lastExecuted = block.timestamp;
        payment.nextExecution = block.timestamp + payment.interval;
        
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
     * @dev Chainlink Automation: Check if upkeep is needed
     */
    function checkUpkeep(bytes calldata /* checkData */) 
        external 
        view 
        override 
        returns (bool upkeepNeeded, bytes memory performData) 
    {
        uint256[] memory readyPayments = new uint256[](10); // Max 10 payments per upkeep
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextPaymentId && count < 10; i++) {
            Payment memory payment = payments[i];
            
            if (payment.isActive && 
                block.timestamp >= payment.nextExecution &&
                usdcToken.balanceOf(payment.payer) >= payment.amount &&
                usdcToken.allowance(payment.payer, address(this)) >= payment.amount) {
                
                readyPayments[count] = i;
                count++;
            }
        }
        
        if (count > 0) {
            // Resize array to actual count
            uint256[] memory finalPayments = new uint256[](count);
            for (uint256 j = 0; j < count; j++) {
                finalPayments[j] = readyPayments[j];
            }
            
            return (true, abi.encode(finalPayments));
        }
        
        return (false, bytes(""));
    }
    
    /**
     * @dev Chainlink Automation: Perform upkeep
     */
    function performUpkeep(bytes calldata performData) external override {
        uint256[] memory paymentIds = abi.decode(performData, (uint256[]));
        
        for (uint256 i = 0; i < paymentIds.length; i++) {
            uint256 paymentId = paymentIds[i];
            Payment storage payment = payments[paymentId];
            
            // Double-check conditions
            if (payment.isActive && 
                block.timestamp >= payment.nextExecution &&
                usdcToken.balanceOf(payment.payer) >= payment.amount &&
                usdcToken.allowance(payment.payer, address(this)) >= payment.amount) {
                
                try this._executePaymentInternal(paymentId) {
                    // Payment executed successfully
                } catch {
                    // Payment execution failed, continue with next payment
                    continue;
                }
            }
        }
    }
    
    /**
     * @dev Check if a payment is due for execution
     */
    function isPaymentDue(uint256 _paymentId) external view returns (bool) {
        Payment storage payment = payments[_paymentId];
        
        if (!payment.isActive) return false;
        if (block.timestamp < payment.nextExecution) return false;
        
        return true;
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
        
        return payment.nextExecution;
    }
    
    /**
     * @dev Get total number of payments
     */
    function getTotalPayments() external view returns (uint256) {
        return nextPaymentId - 1;
    }
}
