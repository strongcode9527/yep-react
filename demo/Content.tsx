import React, {Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import Prism from 'prismjs';
import qs from 'qs';
import {NavBar} from '@jdcfe/yep-react'
import allDocData from './allDocData';
import Demo from './Demo';

import {Helmet} from 'react-helmet'
import {toCamelCase} from '../site/lib/utils'
import App from "./App";

const Content = ({ history, location: { pathname,search } }) => {
  setTimeout(() => {
    Prism.highlightAll();
  }, 100);


  if (pathname.match(/\/component\//)) {
    const componentName = pathname.split('/').reverse()[0];
    const currentComponent = allDocData.components[componentName];
    if (!currentComponent) {
      return (
        <h1>404 page not found</h1>
      );
    }

    const query = qs.parse(search,{ ignoreQueryPrefix: true });
    return (
      <Fragment>
        <NavBar leftContent="返回" onLeftClick={() =>history.push('/')}>{toCamelCase(componentName)}</NavBar>
        <div className="page-wrapper">
          <Helmet title={toCamelCase(componentName)}/>
          {
            currentComponent && currentComponent.demos ? <Demo demo={currentComponent.demos.sort((a, b) => a.order - b.order)[query.order || 0]} componentName={componentName} />  : null
          }
          <style>
            { currentComponent.style || '' }
          </style>
        </div>
      </Fragment>
    );
  }
  return (
    <App/>
  );
};

export default withRouter(Content);
