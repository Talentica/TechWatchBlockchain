import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";

import EOSService from "./services/eos-service";

//eosio endpoint
const endpoint = "http://localhost:8888";
const DRIVER = "maryj";
const PRIVATE_KEY = "5KD7p1TrdyzsmZYE3diMGvf3cSXd6i9tbyhmMCrM9DFS3fqhTiG";

const styles = theme => ({
  card: {
    margin: 20,
    maxWidth: 295,
    minWidth: 275
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 230
  },
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 60
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

function getRoundedTimeInSec(dateInMilliSec) {
  return Math.floor(dateInMilliSec / 1000);
}
class Demo extends React.Component {
  constructor(props) {
    super(props);
    var currentDate = new Date();
    this.state = {
      owner: "premb",
      psname: "",
      intime: getRoundedTimeInSec(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1,
          currentDate.getHours() + 1,
          0,
          0
        ).getTime()
      ),
      outtime: getRoundedTimeInSec(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1,
          currentDate.getHours() + 2,
          0,
          0
        ).getTime()
      ),
      bookingsTable: [],
      input_mandatory_error: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getISOStringInLocalTimezone(dateInSec) {
    var d = new Date(dateInSec * 1000);
    var mm = d.getMonth(),
      dd = d.getDate(),
      yyyy = d.getFullYear(),
      hh = d.getHours(),
      ii = d.getMinutes();

    return yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + ii;
  }
  componentDidMount() {}

  handleChange = event => {
    if (event.target.type === "datetime-local" && event.target.value) {
      var time_in_sec = getRoundedTimeInSec(
        new Date(event.target.value).getTime()
      );
      this.setState({
        [event.target.name]: time_in_sec
      });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };
  handleApprove = event => {};
  handleReject = event => {};
  handleOccupy = event => {};
  handleRelease = async event => {
    //let contract = bookingsTable[event.target.value]
    let parkingdetails = {
      account: DRIVER,
      privateKey: PRIVATE_KEY,
      owner: this.state.owner,
      psname: this.state.psname,
      intime: this.state.intime,
      outtime: this.state.outtime
    };
    try {
      await EOSService.releaseParkingSpace(endpoint, parkingdetails);
      this.props.reloadTable();
    } catch (error) {
      console.log("Test" + error);
      return;
    }
  };

  handleSubmit = async event => {
    event.preventDefault();
    if (
      !this.state.owner ||
      !this.state.psname ||
      !this.state.intime ||
      !this.state.outtime
    ) {
      this.state.input_mandatory_error = "All the input are mandatory.";
      console.log(this.state.input_mandatory_error);
      return;
    }
    let parkingdetails = {
      account: DRIVER,
      privateKey: PRIVATE_KEY,
      owner: this.state.owner,
      psname: this.state.psname,
      intime: this.state.intime,
      outtime: this.state.outtime
    };
    try {
      await EOSService.requestParkingSpace(endpoint, parkingdetails);
      this.props.reloadTable();
    } catch (error) {
      console.log("Test" + error);
      return;
    }
  };

  render() {
    let { bookingsTable } = this.state;
    const { classes } = this.props;
    if (this.state.intime > this.state.outtime)
      this.state.outtime = this.state.intime;

    return (
      <div>
        <form className={classes.root} onSubmit={this.handleSubmit}>
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="owner-label-placeholder">
              Owner
            </InputLabel>
            <Select
              value={this.state.owner}
              onChange={this.handleChange}
              autoWidth
              inputProps={{
                name: "owner",
                id: "owner-label-placeholder"
              }}
            >
              <MenuItem value="">
                <em>clear</em>
              </MenuItem>
              <MenuItem value="amitk">Amit K</MenuItem>
              <MenuItem value="jackn">Jack N</MenuItem>
              <MenuItem value="harryp">Harry P</MenuItem>
              <MenuItem value="premb">Prem B</MenuItem>
            </Select>
            <FormHelperText>Select the parking owner</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="psname-label-placeholder">
              Parking Space
            </InputLabel>
            <Select
              value={this.state.psname}
              onChange={this.handleChange}
              autoWidth
              inputProps={{
                name: "psname",
                id: "psname-label-placeholder"
              }}
            >
              <MenuItem value="">
                <em>clear</em>
              </MenuItem>
              <MenuItem value="Opp Dmart Baner Rd">
                Opp Dmart, Baner Rd
              </MenuItem>
              <MenuItem value="Krishna Bakery, MG Rd">
                Krishna Bakery, MG Rd
              </MenuItem>
              <MenuItem value="590 N Mathilda Ave">590 N Mathilda Ave</MenuItem>
              <MenuItem value="Sign Towers, SouthCity">
                Sign Towers, SouthCity
              </MenuItem>
            </Select>
            <FormHelperText>Choose the parking space name</FormHelperText>
          </FormControl>
          <TextField
            id="datetime-local"
            label="In Time"
            name="intime"
            type="datetime-local"
            value={moment.unix(this.state.intime).format("YYYY-MM-DDTHH:mm")}
            onChange={this.handleChange}
            className={classes.textField}
            required
            InputLabelProps={{
              shrink: true
            }}
            helperText="Select the parking In-Time"
          />
          <TextField
            id="datetime-local"
            label="Out Time"
            name="outtime"
            type="datetime-local"
            value={moment.unix(this.state.outtime).format("YYYY-MM-DDTHH:mm")}
            onChange={this.handleChange}
            className={classes.textField}
            required
            InputLabelProps={{
              shrink: true
            }}
            helperText="Select the parking Out-Time"
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.formButton}
            type="submit"
          >
            Check Availabiliy & Book
          </Button>
        </form>
      </div>
    );
  }
}

Demo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Demo);
