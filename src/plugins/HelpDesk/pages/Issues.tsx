import React from 'react';
import { useDispatch } from 'react-redux';
import {
	useParams
} from 'react-router-dom';

import {
	alertActions,
	loadingActions,
	alertMessage,
	AppDispatch,
} from '../../../core';

import issueService, { IssueModel } from '../services/issue';
import IssuesTable from '../components/IssuesTable';

export default function Issues(): JSX.Element {
	const { filter }: never = useParams();
	const dispatch: AppDispatch = useDispatch();

	const [data, setData] = React.useState<IssueModel[]>([]);
	const [title, setTitle] = React.useState('');

	const refresh = async () => {
		dispatch(loadingActions.show());
		try {
			setData(await issueService.getAll(filter));
		}
		catch {
			dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
		}
		finally {
			dispatch(loadingActions.hide());
		}
	};

	const handleFollow = async (issueId: number) => {
		dispatch(loadingActions.show());
		try {
			await issueService.follow(issueId);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(loadingActions.hide());
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
		}
	}

	const handleUnFollow = async (issueId: number) => {
		dispatch(loadingActions.show());
		try {
			await issueService.unFollow(issueId);
			dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
			refresh();
		}
		catch {
			dispatch(loadingActions.hide());
			dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
		}
	}

	React.useEffect(() => {
		refresh();

		switch (filter) {
			case "my-supported":
				setTitle('Issue bạn đã nhận hỗ trợ');
				break;
			case "all":
				setTitle('Tất cả issue');
				break;
			case "waiting":
				setTitle('Issue đang chờ phản hồi');
				break;
			default:
				setTitle('Issue của bạn');
				break;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter]);

	return (
		<IssuesTable
			title={title}
			data={data}
			onFollow={handleFollow}
			onUnFollow={handleUnFollow}
		/>
	);
}