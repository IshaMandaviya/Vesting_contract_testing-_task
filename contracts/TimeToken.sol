// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TimeToken is ERC20, Ownable {
    using SafeERC20 for IERC20;
    //uint256 _totalSupply = 777777777777 * 1e18;
    address public burnToken;
    constructor () ERC20 ("TimeToken","TC")
    {
        _mint (msg.sender, 100000000 );
    }

    function burn(uint _amount)  public {
        _burn(msg.sender, _amount);
    }
    // constructor(
    //     address _companyReserve,
    //     address _equityInvestors,
    //     address _team,
    //     address _liquidity,
    //     address _foundation,
    //     address _rewards,
    //     address _burnAddr,
    //     address _advisors,
    //     address _crowdsale
    // ) ERC20("Time", "TIME") {
    //     // Minting tokens based on the tokenomics

    //     // Company Reserve 25% of totalSupply
    //     _mint(_companyReserve, (25 * _totalSupply) / 100);

    //     // Equity Investors 3% of totalSupply
    //     _mint(_equityInvestors, (3 * _totalSupply) / 100);

    //     // Team 10% of totalSupply
    //     _mint(_team, (_totalSupply) / 10);

    //     // Liquidity 5% of totalSupply
    //     _mint(_liquidity, (5 * _totalSupply) / 100);

    //     // Foundation 10% of totalSupply
    //     _mint(_foundation, (_totalSupply) / 10);

    //     // Staking and Rewards 25% of totalSupply
    //     _mint(_rewards,(25*_totalSupply)/100);

    //     // Burn 2% of totalSupply
    //     _mint(_burnAddr,(2*_totalSupply)/100);

    //     // Partnerships/Advisors 10% of totalSupply
    //     _mint(_advisors,(_totalSupply)/10);

    //     // Crowdsale 10% of totalSupply
    //     _mint(_crowdsale,(_totalSupply)/10);

    //     // Burnable address 
    //     burnToken = _burnAddr;
    // }

    // function burn(uint256 amount) public virtual override {
    //     require(msg.sender==burnToken, "Sorry burning role has not been assigned to you");
    //     super.burn(amount);
    // }

    // function burnFrom(address account, uint256 amount) public virtual override{
    //     require(msg.sender==burnToken, "Sorry burning role has not been assigned to you");
    //     super.burnFrom(account,amount);
    // }
}
