import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import EOSService from "./services/eos-service";

//eosio endpoint
const endpoint = "http://localhost:8888";

const styles = theme => ({
  card: {
    margin: 20,
    minWidth: 275,
    maxWidth: 295
  }
});

class ContractReviewCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleApprove = this.handleApprove.bind(this);
    this.handleReject = this.handleReject.bind(this);
    this.handleOccupy = this.handleOccupy.bind(this);
    this.handleRelease = this.handleRelease.bind(this);
  }

  handleApprove = async event => {
    let parkingdetails = {
      account: this.props.owner,
      privateKey: this.props.store[this.props.owner],
      driver: this.props.driver,
      psname: this.props.psname,
      intime: this.props.intime
    };
    try {
      await EOSService.approveParkingSpaceRequest(endpoint, parkingdetails);
      this.props.reloadTable();
    } catch (error) {
      console.log("Approve: " + error);
      return;
    }
  };
  handleReject = async event => {
    let parkingdetails = {
      account: this.props.owner,
      privateKey: this.props.store[this.props.owner],
      driver: this.props.driver,
      psname: this.props.psname,
      intime: this.props.intime
    };
    try {
      await EOSService.rejectParkingSpaceRequest(endpoint, parkingdetails);
      this.props.reloadTable();
    } catch (error) {
      console.log("Reject: " + error);
      return;
    }
  };
  handleOccupy = async event => {
    let parkingdetails = {
      account: this.props.driver,
      privateKey: this.props.store[this.props.driver],
      owner: this.props.owner,
      psname: this.props.psname,
      intime: this.props.intime
    };
    try {
      await EOSService.occupyParkingSpace(endpoint, parkingdetails);
      this.props.reloadTable();
    } catch (error) {
      console.log("Occupy: " + error);
      return;
    }
  };
  handleRelease = async event => {
    let parkingdetails = {
      account: this.props.driver,
      privateKey: this.props.store[this.props.driver],
      owner: this.props.owner,
      psname: this.props.psname,
      intime: this.props.intime,
      outtime: this.props.outtime
    };
    try {
      await EOSService.releaseParkingSpace(endpoint, parkingdetails);
      this.props.reloadTable();
    } catch (error) {
      console.log("Release: " + error);
      return;
    }
  };

  render() {
    const {
      classes,
      key,
      owner,
      driver,
      psname,
      intime,
      outtime,
      status
    } = this.props;

    return (
      <Card className={classes.card} key={key}>
        <CardContent>
          <Typography variant="headline" component="h3">
            {psname}
          </Typography>
          <Typography component="pre">Owner: {owner}</Typography>
          <Typography component="pre">Driver: {driver}</Typography>
          <Typography
            style={{ fontSize: 12 }}
            color="textSecondary"
            gutterBottom
          >
            In Time: {new Date(intime * 1000).toISOString()}
          </Typography>
          <Typography
            style={{ fontSize: 12 }}
            color="textSecondary"
            gutterBottom
          >
            Out Time: {new Date(outtime * 1000).toISOString()}
          </Typography>
          <Typography component="pre">
            Status:{" "}
            {status === 1
              ? "Requested"
              : status === 2
              ? "Approved"
              : status === 3
              ? "Occupied"
              : "Released"}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={this.handleApprove}>
            Approve
          </Button>
          <Button size="small" color="primary" onClick={this.handleReject}>
            Reject
          </Button>
          <Button size="small" color="primary" onClick={this.handleOccupy}>
            Occupy
          </Button>
          <Button size="small" color="primary" onClick={this.handleRelease}>
            Release
          </Button>
        </CardActions>
      </Card>
    );
  }
}

ContractReviewCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContractReviewCard);
