#include <eosiolib/eosio.hpp>
#include <vector>

using namespace eosio;

class [[eosio::contract("tic.tac.toe")]] tic_tac_toe : public eosio::contract{
public:
	using contract::contract;
	
	tic_tac_toe(name self, name code, datastream<const char*> ds) 
      : contract(self, code, ds)
	{   }

   [[eosio::action]]
   void create(const name& challenger, const name& host);

   [[eosio::action]]
   void restart(const name& challenger, const name& host, const name& by);
   
   [[eosio::action]]
   void close(const name& challenger, const name& host);

   [[eosio::action]]
   void move(const name& challenger, const name& host, const name& by, const uint16_t& row, const uint16_t& column);

	struct [[eosio::table]] game {
      static const uint16_t board_width = 3;
      static const uint16_t board_height = board_width;
      game() { 
         initialize_board(); 
      }
      name          challenger;
      name          host;
      name          turn; // = account name of host/ challenger
      //name          winner = N(none); // = none/ draw/ name of host/ name of challenger
      name          winner = name("none"); // = none/ draw/ name of host/ name of challenger
      std::vector<uint8_t>  board;

      // Initialize board with empty cell
      void initialize_board() {
         board = std::vector<uint8_t>(board_width * board_height, 0);
      }

      // Reset game
      void reset_game() {
         initialize_board();
         turn = host;
         //winner = N(none);
         winner = name("none");
      }

      uint64_t primary_key() const { return challenger.value; }
      EOSLIB_SERIALIZE( game, (challenger)(host)(turn)(winner)(board))
   };

   struct create {
      	name challenger;
      	name host;
   	};
   struct restart {
      name challenger;
      name host;
      name by;
   };
   struct close {
      name   challenger;
      name   host;
   };
   struct move {
      name   challenger;
      name   host;
      name   by; // the account who wants to make the move
      uint16_t    row;
      uint16_t    column;
   };

	//typedef eosio::multi_index< N(games), game> games;
   typedef eosio::multi_index<"games"_n, game > games;
};

