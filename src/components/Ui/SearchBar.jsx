import { useEffect, useRef, useState } from 'react';
import { getAllUsers } from '../../services/user.service';

export default function SearchBar() {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const initialUsers = useRef([]);

  const [search, setSearch] = useState();

  const inputSearchHandler = (event) => {
    setSearch(event.target.value);
    console.log('Niki onchange -> ', event.target.value)
  };

  const searchHandler = (event) => {
    event.preventDefault();
    console.log('searchHandle -> ', 'test')
    // history.pushState(`/search?name=${search}`)
    setSearch('');
  };

  useEffect(() => {
    (async function () {
      try {
        const data = await getAllUsers();
        setUsers(data);
        console.log('Niki data -> ', users)
        initialUsers.current = data;
      } catch (error) {
        console.error(error)
      }
    })();
  }, []);

  useEffect(() => {
    if (!users) {
      return;
    }
    const updatedUsers = initialUsers.current.filter((user) => {
      return (
        user.username.startsWith(searchValue) ||
        user.email.startsWith(searchValue) ||
        user.firstName.startsWith(searchValue) ||
        user.lastName.startsWith(searchValue) ||
        (user.firstName + ' ' + user.lastName).startsWith(searchValue)
      );
    });
    setUsers(updatedUsers);
  }, [searchValue]);
  

  return (
    <form className="flex items-center">
      <label
        htmlFor="simple-search"
        className="sr-only"
      >
        Search
      </label>

      <div className="relative w-full">
        <input
          onChange={inputSearchHandler}
          type="text"
          id="simple-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search..."
          required
        />
      </div>
      <button
        type="submit"
        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={searchHandler}
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
}
