import React from 'react';
import { i18n } from '@osd/i18n';
import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { TodoList } from './todo/TodoList';
import { TodoForm } from './todo/TodoForm';
import { TodoChartContainer as TodoChart } from './todo/TodoChart';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';

interface TodoAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const TodoAPP = ({
  basename,
  notifications,
  http,
  navigation,
}: TodoAppDeps) => {

  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <navigation.ui.TopNavMenu
            appName={PLUGIN_ID}
            showSearchBar={true}
            useDefaultBehaviors={true}
          />
          <EuiPage restrictWidth="1250px">
            <EuiPageBody component="main">
              <EuiPageHeader>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="customPlugin.helloWorldText"
                      defaultMessage="{name}"
                      values={{ name: PLUGIN_NAME }}
                    />
                  </h1>
                </EuiTitle>
              </EuiPageHeader>
              <EuiPageContent>
                <EuiPageContentBody>
                  <EuiFlexGroup>
                      <EuiFlexItem grow={8}>
                        <TodoList http={http} notifications={notifications} />
                      </EuiFlexItem>
                      <EuiFlexItem grow={4}>
                        <TodoForm http={http} notifications={notifications} />
                      </EuiFlexItem>
                  </EuiFlexGroup>
                  <EuiSpacer size="l" />
                  <EuiFlexGroup>
                      <EuiFlexItem>
                        <TodoChart />
                      </EuiFlexItem>
                  </EuiFlexGroup>                
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
