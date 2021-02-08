import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { useTaskStatusColor } from '../../utils/colors';
import { taskStatusIconName } from '../../utils/status';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { TaskStatusChipExtended_task } from './__generated__/TaskStatusChipExtended_task.graphql';
import { navigateTask } from '../../utils/navigate';

interface Props extends WithTheme {
  task: TaskStatusChipExtended_task;
  className?: string;
}

function TaskStatusChipExtended(props: Props, context) {
  let { task, className } = props;
  let chip = (
    <Chip
      className={className}
      label={`${task.repository.owner}/${task.repository.name} "${task.name}"`}
      onClick={e => navigateTask(context.router, e, task.id)}
      avatar={
        <Avatar style={{ backgroundColor: useTaskStatusColor(task.status) }}>
          <Icon style={{ color: props.theme.palette.background.paper }}>{taskStatusIconName(task.status)}</Icon>
        </Avatar>
      }
    />
  );
  if (task.executingTimestamp && task.executingTimestamp > 0) {
    return (
      <Tooltip title={`Execution started at ${new Date(task.executingTimestamp).toLocaleTimeString()}`}>{chip}</Tooltip>
    );
  }
  return chip;
}

export default createFragmentContainer(withTheme(TaskStatusChipExtended), {
  task: graphql`
    fragment TaskStatusChipExtended_task on Task {
      id
      name
      status
      durationInSeconds
      executingTimestamp
      repository {
        owner
        name
      }
    }
  `,
});
