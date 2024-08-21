'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CommentForm } from './comment-form';
import { createClient } from '@/utils/supabase/client';
// import Date from '@/components/comments/date';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ReplyIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { useHumanizedTimeSince } from '@/hooks/use-humanized-time-since';
import { User } from '@supabase/supabase-js';
// import { getFirstTwoLetters, getUsernameFromEmail } from '@/lib/utils';
import { Comment } from '@/lib/blog.d';

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
    const supabase = createClient();

    async function getCommentUser(id: string): Promise<User> {
        const { data, error } = await supabase.auth.admin.getUserById(id);
        if (error) throw error;
        return data.user;
    }

    const useGetCommentUser = (userId: string) => {
        const [user, setUser] = useState<User | null>(null);

        const getCommentUserCallback = useCallback(async () => {
            const user = await getCommentUser(userId);
            setUser(user);
        }, [userId]);

        useEffect(() => {
            getCommentUserCallback();
        });

        return user!;
    };

    return (
        <div style={{ marginLeft: `${depth * 20}px` }} className="mt-4">
            <hr className="!m-0 py-2" />

            <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10 border">
                    <AvatarImage src="/placeholder-user1.jpg" />
                    <AvatarFallback>
                        {/*{getFirstTwoLetters(*/}
                        {/*    getUsernameFromEmail(useGetCommentUser(comment.user_id)?.email!)*/}
                        {/*)}*/}
                        RU
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="font-medium">
                            {/*{getUsernameFromEmail(useGetCommentUser(comment.user_id)?.email!)}*/}
                            Rand User
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {useHumanizedTimeSince(comment.created_at)} ago
                        </div>
                    </div>
                    {/*
                    <h5 className="mb-2 leading-tight">
                        <a href={`mailto:${email}`}>{name}</a> (
                        <Date dateString={created_at} />)
                    </h5>
                    */}
                    <div className="prose text-muted-foreground">
                        <p>
                            <span dangerouslySetInnerHTML={{ __html: comment.content }}></span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-transparent"
                            onClick={() => setShowReplyForm(!showReplyForm)}
                        >
                            <ReplyIcon className="w-4 h-4" />
                            <span className="sr-only">Reply</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-transparent">
                            <ThumbsUpIcon className="w-4 h-4" />
                            <span className="sr-only">Like</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-transparent">
                            <ThumbsDownIcon className="w-4 h-4" />
                            <span className="sr-only">Dislike</span>
                        </Button>
                    </div>
                </div>
            </div>

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

    const useFetchComments = () => {
        return useCallback(async () => {
            await fetchAllComments();
        }, []);
    };

    const fetchComments = useFetchComments();

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    async function fetchAllComments() {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .eq('approved', true)
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
