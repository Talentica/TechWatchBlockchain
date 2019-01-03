#include "tic_tac_toe.hpp"

using namespace eosio;

bool is_empty_cell(const uint8_t& cell) {
   return cell == 0;
}
bool is_valid_movement(const uint16_t& row, const uint16_t& column, const std::vector<uint8_t>& board) {
   uint32_t movement_location = row * tic_tac_toe::game::board_width + column;
   bool is_valid = column < tic_tac_toe::game::board_width && row < tic_tac_toe::game::board_height && is_empty_cell(board[movement_location]);
   return is_valid;
}

void tic_tac_toe::create(const name& challenger, const name& host) {
   require_auth(host);

   eosio_assert(challenger != host, "challenger shouldn't be the same as host");

   // Check if game already exists
   games existing_host_games(_self, host.value);
   auto itr = existing_host_games.find( challenger.value );
   eosio_assert(itr == existing_host_games.end(), "game already exists");

   existing_host_games.emplace(host, [&]( auto& g ) {
      g.challenger = challenger;
      g.host = host;
      g.turn = host;
   });
}

void tic_tac_toe::restart(const name& challenger, const name& host, const name& by) {
   require_auth(by);

   // Check if game exists
   games existing_host_games(_self, host.value);
   auto itr = existing_host_games.find( challenger.value );
   eosio_assert(itr != existing_host_games.end(), "game doesn't exists");

   // Check if this game belongs to the action sender
   eosio_assert(by == itr->host || by == itr->challenger, "this is not your game!");

   // Reset game
   existing_host_games.modify(itr, itr->host, []( auto& g ) {
      g.reset_game();
   });
}

void tic_tac_toe::close(const name& challenger, const name& host) {
   require_auth(host);

   // Check if game exists
   games existing_host_games(_self, host.value);
   auto itr = existing_host_games.find( challenger.value );
   eosio_assert(itr != existing_host_games.end(), "game doesn't exists");

   // Remove game
   existing_host_games.erase(itr);
}

void tic_tac_toe::move(const name& challenger, const name& host, const name& by, const uint16_t& row, const uint16_t& column ) {
   require_auth(by);

   // Check if game exists
   games existing_host_games(_self, host.value);
   auto itr = existing_host_games.find( challenger.value );
   eosio_assert(itr != existing_host_games.end(), "game doesn't exists");

   // Check if this game hasn't ended yet
   eosio_assert(itr->winner == name("none"), "the game has ended!");
   // Check if this game belongs to the action sender
   eosio_assert(by == itr->host || by == itr->challenger, "this is not your game!");
   // Check if this is the  action sender's turn
   eosio_assert(by == itr->turn, "it's not your turn yet!");


   // Check if user makes a valid movement
   eosio_assert(is_valid_movement(row, column, itr->board), "not a valid movement!");

   // Fill the cell, 1 for host, 2 for challenger
   const uint8_t cell_value = itr->turn == itr->host ? 1 : 2;
   const auto turn = itr->turn == itr->host ? itr->challenger : itr->host;
   existing_host_games.modify(itr, itr->host, [&]( auto& g ) {
      g.board[row * tic_tac_toe::game::board_width + column] = cell_value;
      g.turn = turn;
      g.winner = get_winner(g);
   });
}

name get_winner(const tic_tac_toe::game& current_game) {
   auto& board = current_game.board;

   bool is_board_full = true;

   // Use bitwise AND operator to determine the consecutive values of each column, row and diagonal
   // Since 3 == 0b11, 2 == 0b10, 1 = 0b01, 0 = 0b00
   std::vector<uint8_t> consecutive_column(tic_tac_toe::game::board_width, 3 );
   std::vector<uint8_t> consecutive_row(tic_tac_toe::game::board_height, 3 );
   uint32_t consecutive_diagonal_backslash = 3;
   uint32_t consecutive_diagonal_slash = 3;
   for (uint32_t i = 0; i < board.size(); i++) {
      is_board_full &= is_empty_cell(board[i]);
      uint16_t row = uint16_t(i / tic_tac_toe::game::board_width);
      uint16_t column = uint16_t(i % tic_tac_toe::game::board_width);

      // Calculate consecutive row and column value
      consecutive_row[column] = consecutive_row[column] & board[i]; 
      consecutive_column[row] = consecutive_column[row] & board[i];
      // Calculate consecutive diagonal \ value
      if (row == column) {
         consecutive_diagonal_backslash = consecutive_diagonal_backslash & board[i];
      }
      // Calculate consecutive diagonal / value
      if ( row + column == tic_tac_toe::game::board_width - 1) {
         consecutive_diagonal_slash = consecutive_diagonal_slash & board[i]; 
      }
   }

   // Inspect the value of all consecutive row, column, and diagonal and determine winner
   std::vector<uint32_t> aggregate = { consecutive_diagonal_backslash, consecutive_diagonal_slash };
   aggregate.insert(aggregate.end(), consecutive_column.begin(), consecutive_column.end());
   aggregate.insert(aggregate.end(), consecutive_row.begin(), consecutive_row.end());
   for (auto value: aggregate) {
      if (value == 1) {
         print_f("host won !!");
         return current_game.host;
      } else if (value == 2) {
         print_f("challenger won !!");
         return current_game.challenger;
      }
   }
   // Draw if the board is full, otherwise the winner is not determined yet
   if(!is_board_full){
         print_f("next move plz.");
   }
   else{
      print_f("draw!!");
   }
   return is_board_full ? name("draw") : name("none");
}

// Put this in the bottommost part of the contract, after the action handler's definition
EOSIO_DISPATCH( tic_tac_toe, (create)(restart)(close)(move))
