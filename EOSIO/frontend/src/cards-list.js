import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import ContractReviewCard from "./update-card";
import Demo from "./new-request";
import EOSService from "./services/eos-service";

const styles = theme => ({
  card: {
    margin: 20,
    minWidth: 275,
    maxWidth: 295
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  }
});

class ContractReviewsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingsTable: []
    };

    this.reloadBookingTable = this.reloadBookingTable.bind(this);
  }

  componentDidMount() {
    this.reloadBookingTable();
  }

  reloadBookingTable() {
    EOSService.getBookingsTable(this.props.endpoint).then(res =>
      this.setState({ bookingsTable: res.rows })
    );
  }

  render() {
    const cards = this.state.bookingsTable.map((row, i) => (
      <div>
        <Grid item>
          <ContractReviewCard
            endpoint={this.props.endpoint}
            store={this.props.store}
            key={row.pkey}
            owner={row.powner}
            driver={row.pdriver}
            psname={row.pname}
            intime={row.pstart_time}
            outtime={row.pend_time}
            status={row.pcontract_status}
            reloadTable={this.reloadBookingTable}
          />
        </Grid>
      </div>
    ));
    return (
      <div>
        <Grid container spacing={24}>
          {cards}
        </Grid>
        <Demo
          user={this.props.user}
          endpoint={this.props.endpoint}
          store={this.props.store}
          reloadTable={this.reloadBookingTable}
        />
      </div>
    );
  }
}

ContractReviewsList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContractReviewsList);
