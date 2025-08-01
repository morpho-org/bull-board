import React from 'react';
import { AppQueue } from '@bull-board/api/typings/app';
import { QueueActions } from '../../../typings/app';
import { Button } from '../Button/Button';
import { PromoteIcon } from '../Icons/Promote';
import { RetryIcon } from '../Icons/Retry';
import { TrashIcon } from '../Icons/Trash';
import s from './QueueGroupActions.module.css';
import { AppQueueTreeNode } from '../../utils/toTree';
import { PauseIcon } from '../Icons/Pause';
import { PlayIcon } from '../Icons/Play';

interface QueueActionProps {
  group: AppQueueTreeNode;
  actions: QueueActions;
}

function queueGroupQueues(group: AppQueueTreeNode): AppQueue[] {
  const queues = group.children.flatMap(queueGroupQueues);
  if (group.queue != null && !group.queue.readOnlyMode) queues.push(group.queue);

  return queues;
}

export const QueueGroupActions = ({ actions, group }: QueueActionProps) => {
  const queues = queueGroupQueues(group);
  const retriableQueues = queues.filter((queue) => queue.allowRetries);
  const pausableQueues = queues.filter((queue) => !queue.isPaused);

  return (
    <ul className={s.queueActions}>
      {pausableQueues.length > 0 ? (
        <li>
          <Button
            onClick={actions.pauseMultiple(pausableQueues.map(({ name }) => name))}
            className={s.button}
          >
            <PauseIcon />
          </Button>
        </li>
      ) : (
        <li>
          <Button
            onClick={actions.resumeMultiple(queues.map(({ name }) => name))}
            className={s.button}
          >
            <PlayIcon />
          </Button>
        </li>
      )}
      {retriableQueues.length > 0 && (
        <li>
          <Button
            onClick={actions.retryAllMultiple(
              retriableQueues.map(({ name }) => name),
              'failed'
            )}
            className={s.button}
          >
            <RetryIcon />
          </Button>
        </li>
      )}
      {queues.length > 0 && (
        <>
          <li>
            <Button
              onClick={actions.promoteAllMultiple(queues.map(({ name }) => name))}
              className={s.button}
            >
              <PromoteIcon />
            </Button>
          </li>
          <li>
            <Button
              onClick={actions.cleanAllMultiple(
                queues.map(({ name }) => name),
                'failed'
              )}
              className={s.button}
            >
              <TrashIcon />
            </Button>
          </li>
        </>
      )}
    </ul>
  );
};
