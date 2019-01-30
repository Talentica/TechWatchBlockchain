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
import IPFSService from "./services/ipfs-service";

const styles = theme => ({
  card: {
    margin: 20,
    maxWidth: 295,
    minWidth: 275
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
      parkingsTable: [],
      input_mandatory_error: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    IPFSService.getAvailableParkingSpaces(res => {
      var parkingData = JSON.parse(res);
      this.setState({ parkingsTable: parkingData.ParkingSpaces });
    });
  }
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
      account: this.props.user,
      privateKey: this.props.store[this.props.user],
      owner: this.state.owner,
      psname: this.state.psname,
      intime: this.state.intime,
      outtime: this.state.outtime
    };
    try {
      await EOSService.requestParkingSpace(this.props.endpoint, parkingdetails);
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

    const ownerMenu = this.state.parkingsTable.map((row, i) => (
      <MenuItem value={row.owner}>{row.name}</MenuItem>
    ));
    const psMenu = this.state.parkingsTable.map((row, i) => (
      <MenuItem value={row.psname}>{row.psname}</MenuItem>
    ));

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
              {ownerMenu}
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
              {psMenu}
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
