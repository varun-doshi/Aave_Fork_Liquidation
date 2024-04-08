// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
interface AggregatorInterface {
  function latestAnswer() external view returns (int256);
  function latestTimestamp() external view returns (uint256);
  function latestRound() external view returns (uint256);
  function getAnswer(uint256 roundId) external view returns (int256);
  function getTimestamp(uint256 roundId) external view returns (uint256);

  event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 updatedAt);
  event NewRound(uint256 indexed roundId, address indexed startedBy, uint256 startedAt);
}
contract Oracle is AggregatorInterface{

    int256 public PRICE=1818676704122;

    function getAssetPrice() public view returns(int256){
        return PRICE;
    }

    function updatePrice(int256 price) public returns(int256){
        PRICE=price;
        return PRICE;
    }

     function latestAnswer() external view override returns (int256) {
        return PRICE;
    }

    function latestTimestamp() external view override returns (uint256) {
        // Return current block timestamp as an example
        return block.timestamp;
    }

    function latestRound() external view override returns (uint256) {
        // Return a default value for the latest round
        return uint256(PRICE);
    }

    function getAnswer(uint256 roundId) external view override returns (int256) {
        // Return the latest answer for any roundId (since it's a constant value)
        return PRICE;
    }

    function getTimestamp(uint256 roundId) external view override returns (uint256) {
        // Return the current block timestamp for any roundId (since it's a constant value)
        return block.timestamp;
    }

}