/* eslint-disable react/jsx-first-prop-new-line */

import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import _ from 'lodash';

import { addAllOption } from 'components/Input/ReactSelect';

class FilterBar extends Component {
  static propTypes = {
    siteLocationOptions: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    sites: PropTypes.array.isRequired,
    indications: PropTypes.array.isRequired,
    schedules: PropTypes.array.isRequired,
    fetchingSites: PropTypes.bool,
    filter: PropTypes.object.isRequired,
    updateFilter: PropTypes.func.isRequired,
  }

  state = {
    siteLocation: null,
    indication: null,
    protocol: null,
    siteLocationOptions: [],
    indicationOptions: [],
    protocolOptions: [],
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.siteLocationOptions !== nextProps.siteLocationOptions) {
      const siteLocationOptions = addAllOption(nextProps.siteLocationOptions);
      this.setState({
        siteLocationOptions,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { siteLocationOptions, isAdmin } = this.props;

    if (!isAdmin) {
      if (prevState.siteLocation === null || prevState.siteLocation.siteId !== this.state.siteLocation.siteId) {  // prevent recursive render
        const site = siteLocationOptions[0];
        if (site) {
          this.handleFilterChange('siteLocation', site);
        }
      }
    }
  }

  handleFilterChange = (field, option) => {
    const newValue = option ? option.value : '';

    switch (field) {
      case 'siteLocation':
        this.handleSiteLocationChoose(option);
        break;
      case 'indication':
        this.handleIndicationChoose(option);
        break;
      default:
        break;
    }

    this.props.updateFilter(field, newValue);
  }

  handleSiteLocationChoose(siteLocationOption) {
    if (siteLocationOption) {
      const { sites, indications } = this.props;
      let indicationOptions;

      if (siteLocationOption.value === 'All') {
        const indicationIds = _.chain(sites)
          .map(site => site.studies)
          .flatten()
          .map(study => study.indication_id)
          .uniq()
          .value();
        indicationOptions = indicationIds.map(id => {
          const i = _.find(indications, { id });
          let protocolOptions = _.flatten(sites.map(site => site.studies))
            .filter(s => s.indication_id === id)
            .map(s => ({
              label: s.protocolNumber,
              value: s.protocolNumber,
            }));
          protocolOptions = addAllOption(protocolOptions);
          return {
            label: i.name,
            value: i.name,
            protocolOptions,
          };
        });
        indicationOptions = addAllOption(indicationOptions, {
          label: 'All',
          value: 'All',
          protocolOptions: addAllOption(_.flatten(sites.map(site => site.studies)).map(s => ({
            label: s.protocolNumber,
            value: s.protocolNumber,
          }))),
        });
      } else {
        const selectedSite = sites.filter(s => s.id === siteLocationOption.siteId)[0];
        if (!selectedSite) {
          throw new Error('SiteLocation options are not properly populated.');
        }
        const indicationIds = _.uniq(selectedSite.studies.map(study => study.indication_id));
        indicationOptions = indicationIds.map(id => {
          const i = _.find(indications, { id });
          let protocolOptions = selectedSite.studies.filter(s => s.indication_id === id)
            .map(s => ({
              label: s.protocolNumber,
              value: s.protocolNumber,
            }));
          protocolOptions = addAllOption(protocolOptions);
          return {
            label: i.name,
            value: i.name,
            protocolOptions,
          };
        });
        indicationOptions = addAllOption(indicationOptions, {
          label: 'All',
          value: 'All',
          protocolOptions: addAllOption(selectedSite.studies.map(s => ({
            label: s.protocolNumber,
            value: s.protocolNumber,
          }))),
        });
      }

      this.setState({
        siteLocation: siteLocationOption,
        protocol: null,
        indicationOptions,
      });
    } else {
      this.setState({
        siteLocation: null,
        indication: null,
        protocol: null,
        indicationOptions: [],
        protocolOptions: [],
      });
    }
  }

  handleIndicationChoose(indicationOption) {
    if (indicationOption) {
      this.setState({
        indication: indicationOption,
        protocolOptions: indicationOption.protocolOptions,
      });
    } else {
      this.setState({
        indication: null,
        protocol: null,
        protocolOptions: [],
      });
    }
  }

  render() {
    const {
      isAdmin,
      fetchingSites,
      filter,
    } = this.props;
    const { siteLocationOptions } = this.state;

    return (
      <form action="#" className="form-search clearfix alt">
        <div className="fields-holder">
          <div className="search-area pull-left">
            <div className="field">
              <input type="search" id="search" className="form-control keyword-search" placeholder="Search"
                onChange={(ev) => this.handleFilterChange('patientName', ev.target)}
              />
              <label htmlFor="search"><i className="icomoon-icon_search2" /></label>
            </div>
          </div>
          <div className="pull-left custom-select">
            <Select
              className="form-control data-search"
              value={filter.siteLocation}
              disabled={fetchingSites || !isAdmin}
              options={siteLocationOptions}
              placeholder="Select Site Location"
              onChange={(option) => this.handleFilterChange('siteLocation', option)}
            />
          </div>
          <div className="pull-left custom-select">
            <Select
              className="form-control data-search"
              value={filter.indication}
              options={this.state.indicationOptions}
              disabled={this.state.siteLocation === null}
              placeholder={this.state.siteLocation ? 'Select Indication' : 'N/A'}
              onChange={(option) => this.handleFilterChange('indication', option)}
            />
          </div>
          <div className="pull-left custom-select">
            <Select
              className="form-control data-search"
              value={filter.protocol}
              options={this.state.protocolOptions}
              disabled={this.state.indication === null}
              placeholder={this.state.indication ? 'Select Protocol' : 'N/A'}
              onChange={(option) => this.handleFilterChange('protocol', option)}
            />
          </div>
        </div>
      </form>
    );
  }
}

export default FilterBar;
