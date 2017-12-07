import React, { Component, PropTypes } from 'react';
import Form from 'react-bootstrap/lib/Form';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Field, reduxForm } from 'redux-form';
import { map } from 'lodash';

import Input from 'components/Input';
import ReactSelect from 'components/Input/ReactSelect';
import { selectSearchStudiesFormError } from './selectors';
import { selectClientSites } from 'containers/App/selectors';
import { selectStudies } from 'containers/HomePage/selectors';
import formValidator from './validator';
import { ACTIVE_STATUS_VALUE, INACTIVE_STATUS_VALUE } from 'containers/HomePage/constants';
import LoadingSpinner from 'components/LoadingSpinner';

const mapStateToProps = createStructuredSelector({
  clientSites: selectClientSites(),
  studies: selectStudies(),
  hasError: selectSearchStudiesFormError(),
});

@reduxForm({ form: 'searchStudies', validate: formValidator })
@connect(mapStateToProps, null)

class SearchStudiesForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clientSites: PropTypes.object,
    studies: PropTypes.object,
    hasError: PropTypes.bool,
    handleSubmit: PropTypes.func,
  };

  render() {
    const { clientSites, studies, hasError, handleSubmit } = this.props;
    const siteOptions = map(clientSites.details, siteIterator => ({
      label: siteIterator.name,
      value: siteIterator.id,
    }));
    const statusOptions = [{ label: 'Active', value: ACTIVE_STATUS_VALUE }, { label: 'Inactive', value: INACTIVE_STATUS_VALUE }];

    return (
      <Form className="form-search form-search-studies pull-left" onSubmit={handleSubmit}>
        <div className="fields-holder clearfix">
          <div className="search-area pull-left">
            <div className="field">
              <Field
                name="name"
                component={Input}
                type="text"
                className="keyword-search"
                placeholder="Search..."
                disabled={clientSites.fetching || studies.fetching}
              />
              <label htmlFor="search">
                <i className="icomoon-icon_search2" />
              </label>
            </div>
          </div>
          <div className="pull-left custom-select">
            <Field
              name="site"
              component={ReactSelect}
              placeholder="Select Site Location"
              options={siteOptions}
              disabled={clientSites.fetching || studies.fetching}
            />
          </div>
          <div className="pull-left custom-select">
            <Field
              name="status"
              component={ReactSelect}
              placeholder="Select Status"
              options={statusOptions}
              disabled={clientSites.fetching || studies.fetching}
            />
          </div>
          <div className="hidden">
            <button type="submit" className="btn btn-primary btn-search" disabled={clientSites.fetching || studies.fetching || hasError}>
              {(studies.fetching)
                ? <LoadingSpinner showOnlyIcon size={20} />
                : <span>Search</span>
              }
            </button>
          </div>
        </div>
      </Form>
    );
  }
}

export default SearchStudiesForm;
