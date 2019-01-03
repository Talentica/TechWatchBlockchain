#include <iterator>
#include <eosiolib/time.hpp>
#include "pademo.hpp"

using namespace std;

void pademo::request(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime, uint64_t endtime){
   	require_auth(driver);
	auto ownerindex = _pcontracts.get_index<name("getbyowner")>();

	auto loentry = ownerindex.lower_bound(owner.value);
	auto hientry = ownerindex.upper_bound(owner.value);
	bool dupFound = false;
	for (;loentry != hientry; loentry++){
		if(loentry->pdriver == driver && loentry->pname == parkingspace && loentry->pstart_time == starttime)
		{
			dupFound = true;
			break;
		}
	}

	if(!dupFound){
		_pcontracts.emplace(driver, [&]( auto& con ) { //driver is the payer here.
		  con.pkey = _pcontracts.available_primary_key();
	      con.powner = owner;
	      con.pdriver = driver;
	      con.pname = parkingspace;
	      con.pstart_time = starttime;
	      con.pend_time = endtime;
	      con.pcontract_status = 1;
	   });
	}

	//auto currTimeInSeconds = time_point_sec(now());
	//eosio::print("curr time : ", currTimeInSeconds.sec_since_epoch());
}

void pademo::approve(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime)
{
	require_auth(owner);
	auto ownerindex = _pcontracts.get_index<name("getbyowner")>();
	
	auto loentry = ownerindex.lower_bound(owner.value);
	auto hientry = ownerindex.upper_bound(owner.value);
	eosio_assert(loentry != ownerindex.end(), "owner does not have any contract.");
	for (;loentry!= ownerindex.end() && loentry != hientry; loentry++){
		//eosio::print("loentry : ", loentry->powner, ",", loentry->pdriver, ",", loentry->pname, ",", loentry->pstart_time);
		if(loentry->pdriver != driver || loentry->pname != parkingspace || loentry->pstart_time != starttime)
			continue;

		ownerindex.modify(loentry, owner, [&](auto& con){
			con.pcontract_status = 2;
		});
		break;
	}

	eosio_assert(loentry != hientry, "matching contract not found.");
}

void pademo::reject(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime)
{
	require_auth(owner);

	deleteContract(driver, owner, parkingspace, starttime);

	auto size = std::distance(_pcontracts.cbegin(),_pcontracts.cend());
	eosio::print("Table Size after reject = ", size);
}

void pademo::occupy(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime)
{
	require_auth(driver);
	auto ownerindex = _pcontracts.get_index<name("getbyowner")>();
	auto loentry = ownerindex.lower_bound(owner.value);
	auto hientry = ownerindex.upper_bound(owner.value);
	eosio_assert(loentry != ownerindex.end(), "owner does not have any contract.");

	for (;loentry!= ownerindex.end() && loentry != hientry; loentry++){
		if(loentry->pdriver != driver || loentry->pname != parkingspace || loentry->pstart_time != starttime)
			continue;
		
		auto currTime = time_point_sec(now());
		eosio_assert(loentry->pstart_time <= currTime.sec_since_epoch(), "Can not occupy before the scheduled time.");

		ownerindex.modify(loentry, owner, [&](auto& con){
			con.pcontract_status = 3;
		});
		break;
	}
	eosio_assert(loentry != hientry, "matching contract not found.");
}


void pademo::release(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime){
	require_auth(driver);

	deleteContract(driver, owner, parkingspace, starttime);

	auto size = std::distance(_pcontracts.cbegin(),_pcontracts.cend());
	eosio::print("Table Size after release = ", size);
}

void pademo::deleteContract(const name& driver, const name& owner, const std::string& parkingspace, uint64_t starttime)
{
	//auto itr = _pcontracts.find( challenger.value );
	auto ownerindex = _pcontracts.get_index<name("getbyowner")>();
	auto loentry = ownerindex.lower_bound(owner.value);
	auto hientry = ownerindex.upper_bound(owner.value);
	eosio_assert(loentry != ownerindex.end(), "owner does not have any contract.");

	for (;loentry != hientry; loentry++){
		if(loentry->pdriver != driver || loentry->pname != parkingspace || loentry->pstart_time != starttime)
			continue;

		ownerindex.erase(loentry);
		break;
	}

   	eosio_assert(loentry != hientry, "contract doesn't exists.");
}

// Put this in the bottommost part of the contract, after all the action handler's definition
EOSIO_DISPATCH( pademo, (request)(approve)(reject)(occupy)(release))
