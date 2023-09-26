import { useEffect, useState } from "react";
import { requestUsers, requestUsersWithError, User, Query } from "./api";
import "./styles.css";


// Примеры вызова функций, в консоли можно увидеть возвращаемые результаты
requestUsers({ name: "", age: "", limit: 4, offset: 0 }).then(console.log);
requestUsersWithError({ name: "", age: "", limit: 4, offset: 0 }).catch(
  console.error
);

export default function App() {

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [users, setUsers] = useState<User[]>()

  const [error, setError] = useState('')

  const [name, setName] = useState<string>('')
  const [age, setAge] = useState<string>('')
  const [offset, setOffset] = useState<number>(0)
  const [limit, setLimit] = useState<number>(4)

  const [page, setPage] = useState(0)

  const [pagination, setPagination] = useState(0)

  const [isNext, setIsNext] = useState(true)

  const onNext = async () => {

    try {
      setIsLoading(true)
      setPagination(pagination + 1)
      const query = {
        name,
        age,
        limit,
        offset
      }
      const res = await requestUsers(query)
      setUsers(res)
      setOffset(offset + res.length)

    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const onPrev = async () => {

    try {
      setIsLoading(true)
      setPagination(pagination - 1)
      const query = {
        name,
        age,
        limit,
        offset: offset - users?.length!
      }
      const res = await requestUsers(query)
      setUsers(res)
      setOffset(offset - res.length)

    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    console.log(offset)
    const isData = async () => {
      const checkQuery = {
        name: "",
        age: "",
        limit: limit,
        offset: offset + 1
      }
      try {
        setIsLoading(true)
        const res = await requestUsers(checkQuery)
        if (res.length === 0) throw new Error()
        return setIsNext(true)
      } catch {
        return setIsNext(false)
      } finally {
        setIsLoading(false)
      }
    }
    isData()
  }, [users])


  console.log(users)

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-black/10 text-[40px]">Loading...</div>
    )
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="min-w-[400px] min-h-fit border-2 flex flex-col gap-2 px-6 py-6">
        <div className="w-full flex flex-row gap-[5px]">
          <form action="">
            <div className="flex flex-row items-center w-full justify-around mb-4">
              <div>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="p-2 rounded-lg border border-black" placeholder="Name" />
              </div>
              <div>
                <input type="text" value={age} onChange={e => setAge(e.target.value)} className="p-2 rounded-lg border border-black" placeholder="Age" />
              </div>
            </div>
            {isLoading ? <div className="w-full h-full flex items-center justify-center">Loading...</div> : <ul className="flex flex-col items-start">
              {users?.map((user: User) => (
                <li className="flex flex-row">
                  <div>{user.name}, </div>
                  {' '}
                  <div>{user.age}</div>
                </li>
              ))}
            </ul>}
            {!isLoading && error && (
              <div className="w-full text-center">{error}</div>
            )}
            {!isLoading && users?.length === 0 && (
              <div className="text-center w-full py-6">No relults found =( </div>
            )}
            <div className="flex flex-row gap-1 items-center">
              <span>By page: </span>
              <input type="number" id="" className="w-fit border border-black" value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
              <button className={`disabled:hover:cursor-not-allowed disabled:bg-rose-300 bg-lime-300`} disabled={isLoading || pagination === 0} onClick={() => onPrev()}>prev</button>
              <div>page: {pagination}</div>
              <button className={`disabled:hover:cursor-not-allowed disabled:bg-rose-300 bg-lime-300`} disabled={!isNext} onClick={() => onNext()}>next</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
