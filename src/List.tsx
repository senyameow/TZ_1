import React from 'react'
import { User } from './api'

const List = ({ users, isLoading }: { users: User[] | undefined, isLoading: boolean }) => {



    return (
        <ul className="flex flex-col items-start">
            {users?.map((user: User) => (
                <li key={user.id} className="flex flex-row">
                    <div>{user.name}, </div>
                    {' '}
                    <div>{user.age}</div>
                </li>
            ))}
            {users?.length === 0 || !users && (
                <div>No results</div>
            )}
            {isLoading && (
                <div>Loading...</div>
            )}
        </ul>
    )
}

export default List