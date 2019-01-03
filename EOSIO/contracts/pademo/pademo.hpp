#include <cstdio>
#include <ctime>
#include <string>
#include <eosiolib/eosio.hpp>


using namespace eosio;

CONTRACT pademo : public eosio::contract{

public:
	using contract::contract;

    pademo( name receiver, name code, datastream<const char*> ds ):
                contract( receiver, code, ds ),
                _pcontracts( receiver, receiver.value ) {}

	  [[eosio::action]]
   	void request(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime, uint64_t endtime);

    [[eosio::action]]
    void approve(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime);

    [[eosio::action]]
    void reject(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime); 

    [[eosio::action]]
    void occupy(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime);

   	[[eosio::action]]
   	void release(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime);

    void deleteContract(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime);

   	TABLE pcontract{
   		uint64_t    pkey;  		// primary key
      	name       	powner;  	// account name for the parking owner
      	name       	pdriver;  	// account name for the driver
      	std::string pname;     // parking space name
      	uint64_t   	pstart_time; // the start time of parking space rent
      	uint64_t   	pend_time; 	// the end time of parking space rent
      	uint8_t	  	pcontract_status;	// current status of the contract : [1=Requested, 2=Approved, 3=Occupied, 4=Released]

      	// primary key
      	auto primary_key() const { return pkey; }
      	// secondary key
      	uint64_t get_by_owner() const { return powner.value; }
   	};

   	typedef eosio::multi_index< name("pcontract"), pcontract,
   	eosio::indexed_by< name("getbyowner"), eosio::const_mem_fun<pcontract, uint64_t, &pcontract::get_by_owner> > 
   	> pcontracts;

   	pcontracts _pcontracts;
};
	