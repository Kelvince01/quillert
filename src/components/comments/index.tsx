import React from 'react';
import { Fragment } from 'react';
import Date from './date';

interface Comment {
    id: string;
    created_at: string;
    name: string;
    email: string;
    comment: string;
}

interface CommentsProps {
    comments?: Comment[];
}

export function Comments({ comments = [] }: CommentsProps): React.JSX.Element {
    return (
        <Fragment>
            <h3 className="mt-4 mb-4 leading-tight">Comments:</h3>
            <ul>
                {comments?.map(({ id, created_at, name, email, comment }) => (
                    <li key={id} className="mb-5">
                        <hr className="mb-5" />
                        <h5 className="mb-2 leading-tight">
                            <a href={`mailto:${email}`}>{name}</a> (
                            <Date dateString={created_at} />)
                        </h5>
                        <p>{comment}</p>
                        <hr className="mt-5 mb-5" />
                    </li>
                ))}
            </ul>
        </Fragment>
    );
}
