'use client';

import React, { useEffect, useState } from 'react';
import { CommentForm } from './comment-form';
import { createClient } from '@/utils/supabase/client';
import Date from '@/components/comments/date';

interface Comment {
    id: string;
    user_id: string;
    parent_id?: string;
    content: string;
    created_at: string;
    children?: Comment[];
}

function CommentThread({
    comment,
    postId,
    depth = 0
}: {
    comment: Comment;
    postId: string;
    depth?: number;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false);

    return (
        <div style={{ marginLeft: `${depth * 20}px` }} className="mt-4">
            <hr className="!m-0 py-2" />
            <p>
                {comment.content}{' '}
                <span className="text-sm text-gray-400 italic">
                    (
                    <Date dateString={comment.created_at} />)
                </span>
            </p>
            <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
            {showReplyForm && (
                <CommentForm
                    postId={postId}
                    parentId={comment.id}
                    onSuccess={() => setShowReplyForm(false)}
                />
            )}
            {comment.children?.map((childComment) => (
                <CommentThread
                    key={childComment.id}
                    comment={childComment}
                    postId={postId}
                    depth={depth + 1}
                />
            ))}
        </div>
    );
}

export function Comments({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const supabase = createClient();

    useEffect(() => {
        fetchComments();
    }, [postId]);

    async function fetchComments() {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching comments:', error);
        } else {
            const threaded = threadComments(data);
            setComments(threaded);
        }
    }

    function threadComments(comments: Comment[]): Comment[] {
        const commentMap = new Map<string, Comment>();
        const roots: Comment[] = [];

        comments.forEach((comment) => {
            commentMap.set(comment.id, { ...comment, children: [] });
        });

        commentMap.forEach((comment) => {
            if (comment.parent_id) {
                const parent = commentMap.get(comment.parent_id);
                if (parent) {
                    parent.children?.push(comment);
                }
            } else {
                roots.push(comment);
            }
        });

        return roots;
    }

    return (
        <div>
            <h2>Comments</h2>
            <CommentForm postId={postId} onSuccess={fetchComments} />
            {comments.map((comment) => (
                <CommentThread key={comment.id} comment={comment} postId={postId} />
            ))}
        </div>
    );
}
