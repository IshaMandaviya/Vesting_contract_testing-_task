// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

/// @title A Vesting contract
/// @notice You can use this contract for multiple roles as specified

contract Vesting is Ownable {
    /// @notice All available roles present in the contract
    /// @dev Declaring roles as mentioned an store it in the role variable
    enum allRoles {
        CompanyReserve,
        equityInvestors,
        team,
        exchangeListingsAndLiquidity,
        Ecosystem,
        stakingAndRewards,
        AIRAndBURN,
        partnershipsAndAdvisors
    }
    allRoles private role;

    /// @dev Stores, Each role to the Total tokens available for the Role
    /// @dev takes Role id as input (For Ex, totalTokensForRole[0] returns token available for role 0)
    /// @dev this totalTokensForRole gets assigned in "allocateTokensForRoles" function and updated in "addBeneficiary" function
    mapping(uint256 => uint256) private totalTokensForRole;

    /// @dev To store the data and returns, how many participants are present in a particular role 
    /// @dev This gets updated in "addBeneficiary" func.
    mapping(uint256 => uint256) private totalBeneficiariesInRole;

    /// @dev Token balance left after distributing 90% of tokens to the roles in "allocateTokensForRoles" func .
    uint256 public tokenLeftForVesting;

    /// @dev Amount a  beneficiary can withdraw at the current time
    mapping(bytes32 => uint256) private tokenWithdrawable;

    /// @dev address of the ERC20 token
    IERC20 public token;


    /// @dev Defining the structure of a beneficiary
    struct Beneficiary {
        address beneficiary;
        allRoles role;
        uint256 amount;
        uint256 tokenReceivedTillNow;
        uint256 vestingStartTime;
        uint256 cliff;
        uint256 duration;
        uint256 interval;
        bool isRevokable;
        bool isRevoked;
    }

    /// @dev Map the ID with the Beneficiary .Stores all the Beneficiaries
    /// @dev ID = Keccak256 hash of the beneficiary address and roleId
    mapping(bytes32 => Beneficiary) public beneficiaries;

    /// @dev All TGE percentages for Each role
    /// @dev For Ex, TGE 0% for 0th role,TGE 5% for 1st role etc.
    uint256[8] private TGEPercentages = [0, 5, 0, 25, 0, 14, 50, 0];

    /// @param _token ERC20 token address.
    constructor(IERC20 _token) {
        token = _token;
    }

    /// @notice Assigns tokens amount for every roles 
    /// @notice calculates the token left for ICO
    /// @dev Cannot execute this function, if the token balance of this contract is 0
    /// @dev only owner can execute this function
    function allocateTokensForRoles() external onlyOwner {
        /// @dev Token balance of this contract
        uint256 contractTokenBalance = IERC20(token).balanceOf(address(this));
        require(contractTokenBalance > 0, "No tokens allocated to the contract");

        /// @dev Assign all the tokens to each role with specified percentage
        totalTokensForRole[uint256(allRoles.CompanyReserve)] = (contractTokenBalance * 15) / 100;
        totalTokensForRole[uint256(allRoles.equityInvestors)] = (contractTokenBalance * 3) / 100;
        totalTokensForRole[uint256(allRoles.team)] = (contractTokenBalance * 10) / 100;
        totalTokensForRole[uint256(allRoles.exchangeListingsAndLiquidity)] = (contractTokenBalance * 25) / 100;
        totalTokensForRole[uint256(allRoles.Ecosystem)] = (contractTokenBalance * 10) / 100;
        totalTokensForRole[uint256(allRoles.stakingAndRewards)] = (contractTokenBalance * 15) / 100;
        totalTokensForRole[uint256(allRoles.AIRAndBURN)] = (contractTokenBalance * 2) / 100;
        totalTokensForRole[uint256(allRoles.partnershipsAndAdvisors)] = (contractTokenBalance * 10) / 100;

        /// @dev Sum of the tokens allocated for roles
        uint256 totalTokenAllocatedForRoles = 0;
        for (uint256 i = 0; i < 8; i++) {
            totalTokenAllocatedForRoles += totalTokensForRole[i];
        }

        /// @dev Get the tokens left for ICO
        tokenLeftForVesting = contractTokenBalance - totalTokenAllocatedForRoles;
    }

    /// @notice This function helps to add beneficiary 
    /// @dev only owner can call this function
    /// @param _Beneficiary The address of the beneficiary
    /// @param _role Role of the beneficiary
    /// @param _amount Token amount for Vesting
    /// @param _cliff Cliff time period for this beneficiary
    /// @param _duration duration for this beneficiary
    /// @param _interval interval for this beneficiary
    /// @param _isRevokable Is the beneficiary"s vesting revokable (if yes, pass true,else pass false)
    function addBeneficiary(
        address _Beneficiary,
        allRoles _role,
        uint256 _amount,
        uint256 _cliff,
        uint256 _duration,
        uint256 _interval,
        bool _isRevokable
    ) external onlyOwner {
        require(_Beneficiary != owner(), "Owner cannot be a beneficiary");
        require(_Beneficiary != address(0), "Cannot add a Beneficiary of 0 address");
        require(_amount != 0, "amount should be greater than 0");

        /// @dev Generate the unique id
        bytes32 id = keccak256(abi.encodePacked(_Beneficiary, _role));

        /// @dev Check beneficiary already exists or not
        require(validateBeneficiary(id), "Beneficiary already exist in the role");

        ///@dev If token is available for this role
        require(totalTokensForRole[uint256(_role)] >= _amount, "Not enough Tokens for this role");

        /// @dev Update the total tokens for this role
        totalTokensForRole[uint256(_role)] -= _amount;

        /// @dev Get the TGE amount
        uint256 tgeAmount = (_amount * TGEPercentages[uint256(_role)]) / 100;

        /// @dev build the beneficiary structure
        Beneficiary memory beneficiary = Beneficiary(
            _Beneficiary,
            _role,
            _amount - tgeAmount, // subtract the TGE amount , and save the rest amount for vesting
            0,  // Token Received till Now
            block.timestamp, // vesting start time
            _cliff,
            _duration,
            _interval,
            _isRevokable,
            false // Marking Revoked as false initially
        );

        /// @dev update the count of beneficiary in this role
        totalBeneficiariesInRole[uint256(_role)] += 1;

        /// @dev add the beneficiary to the collection
        beneficiaries[id] = beneficiary;

        /// @dev Save the TGE amount to beneficiary withadrawable
    
        tokenWithdrawable[id] = tgeAmount;


        emit AddedBeneficiary(_Beneficiary, _role, id);
    }

    function validateBeneficiary(bytes32 _id) internal view returns (bool exists) {
        return beneficiaries[_id].beneficiary == address(0);
    }
    
    /// @notice This function helps to revoke a beneficiary
    /// @dev Only Admin can call this function
    /// @param _beneficiary Address of the beneficiary
    /// @param _role Role of the beneficiary
    function revokeBeneficiary(address _beneficiary, allRoles _role) external onlyOwner {
        /// @dev Generate the Hash Id
        bytes32 id = keccak256(abi.encodePacked(_beneficiary, _role));

        /// @dev check beneficiary should exist in the collection
        require(!validateBeneficiary(id), "Beneficiary is not exist in the role");

        /// @dev Get the beneficiary
        Beneficiary storage beneficiary = beneficiaries[id];
        require(beneficiary.isRevokable, "beneficiary is not revokable");

        /// @dev Revoke beneficiary . update the isRevoked to true.
        beneficiary.isRevoked = true;
    }

    /// @notice Admin or a beneficiary can call this func to withdraw tokens 
    /// @dev Admin should release Tokens for the beneficiary ,after that a beneficiary will get his tokens
    /// @param  _beneficiary Address of the beneficiary
    /// @param _role Role of the _beneficiary
    /// @param _withdrawAmount Amount A beneficiary wants to withdraw
    function withdraw(
        address _beneficiary,
        allRoles _role,
        uint256 _withdrawAmount
    ) external {

        bytes32 id = keccak256(abi.encodePacked(_beneficiary, _role));

        /// @dev check beneficiary should  exists
        require(!validateBeneficiary(id), "Beneficiary is not exist in the role");

        require(
            msg.sender == owner() || keccak256(abi.encodePacked(msg.sender, _role)) == id,
            "Admin or beneficiary required"
        );

        require(_withdrawAmount > 0, "Withdrawable should be greater than 0");

        ///@dev withDraw amount should not greater than total releasable
        require(tokenWithdrawable[id] >= _withdrawAmount, "Token released amount is less");

        /// @dev update the total withdrawable tokens
        tokenWithdrawable[id] -= _withdrawAmount;

        /// @dev Transfer the tokens
        IERC20(token).transfer(_beneficiary, _withdrawAmount);

        emit TokenWithdraw(_beneficiary, _withdrawAmount, tokenWithdrawable[id]);
    }

    /// @notice This function release the vested tokens for a beneficiary , stores it in "tokenWithdrawable" so that beneficiary can withdraw tokens.
    /// @dev Admin can call this function
    /// @param _beneficiary Address of the _beneficiary
    /// @param _role Role of the _beneficiary
    function release(address _beneficiary, allRoles _role) external onlyOwner {
        
        bytes32 id = keccak256(abi.encodePacked(_beneficiary, _role));

        /// @dev  beneficiary should  exists
        require(!validateBeneficiary(id), "Beneficiary is not exist in the role");

        Beneficiary storage beneficiary = beneficiaries[id];
        require(!beneficiary.isRevoked, "beneficiary is revoked");

        /// @dev all vested tokens for this _beneficiary Till Now
        uint256 totalVestedTokens = vestedTokenForRole(id);

        /// @dev Subtract the totalVestedTokens from tokenReceivedTillNow ,we will get amount that is going to release Now 
        uint256 releaseTokens = totalVestedTokens - beneficiary.tokenReceivedTillNow;

        require(releaseTokens > 0, "No Tokens released yet,try after some time");
        /// @dev update the amount of user Received till now
        beneficiary.tokenReceivedTillNow += releaseTokens;

        /// @dev Update the tokenWithdrawable for this _beneficiary
        tokenWithdrawable[id] += releaseTokens;

    

        emit TokenReleased(_beneficiary, releaseTokens, tokenWithdrawable[id]);
    }

    /// @dev Calculates the Token amount vested till Now for a specific _beneficiary
    /// @dev this is Internal function
    /// @param _id Id of the _beneficiary ,
    function vestedTokenForRole(bytes32 _id) internal view returns (uint256 TokenVested) {
        Beneficiary memory beneficiary = beneficiaries[_id];
        /// @dev Amount vested for this _beneficiary
        uint256 totalTokenAmount = beneficiary.amount;

        /// @dev cliff time of the _beneficiary
        /// @dev Adding the start time of the vesting with the cliff time
        uint256 cliff = beneficiary.cliff + beneficiary.vestingStartTime;

        ///@dev duration of the vesting for this _beneficiary
        uint256 duration = beneficiary.duration;

        /// @dev If cliff time is not finished
        if (block.timestamp < cliff) {
            return 0;
        /// @dev if duration is over     
        } else if (block.timestamp >= beneficiary.vestingStartTime + duration) { 
            return totalTokenAmount;

        } else {

            ///@dev round of How many Interval passed
            uint256 vestedInterval = (block.timestamp - cliff) / beneficiary.interval;
            /// @dev calculate the vested time 
            // console.log(vestedInterval);
            uint256 vestedTime = vestedInterval * beneficiary.interval;
            ///@dev return the vested token amount
            return (totalTokenAmount * vestedTime) / (duration-beneficiary.cliff);
        }
    }

    /// @dev get Releasable Token amount
    function getReleasableAmount(address _beneficiary, allRoles _role) external view returns (uint256) {
        ///@dev get the ID
        bytes32 id = keccak256(abi.encodePacked(_beneficiary, _role));

        Beneficiary memory beneficiary = beneficiaries[id];
        uint256 totalVestedTokens = vestedTokenForRole(id);

        uint256 releaseTokens = totalVestedTokens - beneficiary.tokenReceivedTillNow;

        return releaseTokens;
    }

    /// @dev return the token amount user can withdraw
    function getTokenWithdrawable(address _beneficiary, allRoles _role) external view returns (uint256) {
        //get the ID
        bytes32 id = keccak256(abi.encodePacked(_beneficiary, _role));

        return tokenWithdrawable[id];
    }

    /// @dev Get next vesting schedule
    function getNextVestingSchedule(address _beneficiary, allRoles _role) external view returns (uint256) {
        //get the ID
        bytes32 id = keccak256(abi.encodePacked(_beneficiary, _role));
        
        /// @dev check beneficiary should  exists
        require(!validateBeneficiary(id), "Beneficiary is not exist in the role");


        ///@dev get the beneficiary
        Beneficiary memory beneficiary = beneficiaries[id];

        uint256 cliff = beneficiary.cliff + beneficiary.vestingStartTime;
        

        ///@dev If cliff time is not finished
        if (block.timestamp <= cliff) {
            return cliff + beneficiary.interval;
        }
        else if(block.timestamp >= beneficiary.vestingStartTime + beneficiary.duration){
            return 0;
        }
        else{
            /// @dev Calculate the Interval passed till Now
             uint256 vestedInterval = (block.timestamp - cliff) / beneficiary.interval;

            //start = 50
            //dur = 400
            //inter = 200
            //cliff = 100 + 50 =150
            // cuur = 200 
            // 50 / 200 = 0.25 ->0
            //vested interval = 0
            //vesting time = (0 +1) * 200 = 200

            ///  @dev Time for next Interval
            uint256 vestedTime = (vestedInterval + 1) * beneficiary.interval;
            /// @dev return the timeStamp
            return cliff + vestedTime;
        }
        
    }

     ///@dev get the Id of a _beneficiary
    function getId(address _beneficiary, allRoles _role) external pure returns(bytes32){
        return keccak256(abi.encodePacked(_beneficiary,_role));
    }

    /* All Events */
    event startedVesting(uint256 cliff, uint256 duration);
    event AddedBeneficiary(address Beneficiary, allRoles role, bytes32 id);
    event TokenReleased(address Beneficiary, uint256 tokenReleased, uint256 totalTokenWithdrawable);
    event TokenWithdraw(address Beneficiary, uint256 withdrawAmount, uint256 totalTokenWithdrawable);
}