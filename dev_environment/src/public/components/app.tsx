import React, { useState } from 'react';
import { i18n } from '@osd/i18n';
import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  EuiButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { TodoList } from './todo/TodoList';
import { TodoForm } from './todo/TodoForm';
import { TodoChart } from './todo/TodoChart';

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
  // Use React hooks to manage state.
  // const [timestamp, setTimestamp] = useState<string | undefined>();

  // const onClickHandler = () => {
  //   // Use the core http service to make a response to the server API.
  //   http.get('/api/custom_plugin/example').then((res) => {
  //     setTimestamp(res.time);
  //     // Use the core notifications service to display a success message.
  //     notifications.toasts.addSuccess(
  //       i18n.translate('customPlugin.dataUpdated', {
  //         defaultMessage: 'Data updated',
  //       })
  //     );
  //   });
  // };

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
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
                {/* <EuiPageContentHeader>
                  <EuiTitle>
                    <h2>
                      <FormattedMessage
                        id="customPlugin.congratulationsTitle"
                        defaultMessage="Congratulations, you have successfully created a new OpenSearch Dashboards Plugin!"
                      />
                    </h2>
                  </EuiTitle>
                </EuiPageContentHeader> */}
                <EuiPageContentBody>
                  <EuiFlexGroup>
                      <EuiFlexItem grow={8}>
                        {/* TodoList component will go here */}
                        <TodoList http={http} notifications={notifications} />
                      </EuiFlexItem>
                      <EuiFlexItem grow={4}>
                        {/* TodoForm component will go here */}
                        <TodoForm http={http} notifications={notifications} />
                      </EuiFlexItem>
                  </EuiFlexGroup>
                  <EuiSpacer size="l" />
                  <EuiFlexGroup>
                      <EuiFlexItem>
                        {/* TodoChart component will go here */}
                        <TodoChart http={http} />
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
