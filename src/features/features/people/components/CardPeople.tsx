import { useAddFollowUser } from '@/api/people';

interface CardPeopleProps {
  id: number;
  name: string;
  is_followed: boolean;
}

export default function CardPeople(props: CardPeopleProps) {
  const {
    mutate: mutateAddFollowUser,
  } = useAddFollowUser();

  return <>
    <div
      className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-end px-4 pt-4">
        <button id="dropdownButton" data-dropdown-toggle="dropdown"
                className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                type="button">
          <span className="sr-only">Open dropdown</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
               viewBox="0 0 16 3">
            <path
              d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
        </button>
        <div id="dropdown"
             className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
          <ul className="py-2" aria-labelledby="dropdownButton">
            <li>
              <a href="#"
                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
            </li>
            <li>
              <a href="#"
                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export
                Data</a>
            </li>
            <li>
              <a href="#"
                 className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center pb-10">
        <img className="w-24 h-24 mb-3 rounded-full shadow-lg"
             src="data:image/png;base64,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"
             alt="Bonnie image" />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {props.name}
        </h5>

        <div className="flex mt-4 md:mt-6">
          {!props.is_followed && (
            <button
              type={'button'}
              className={'inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'}
              onClick={() => {
                mutateAddFollowUser({
                  user_id: props.id,
                });
              }}
            >
              Add friend
            </button>
          ) || (
            <button
              type={'button'}
              className={'inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'}
            >
              Followed!
            </button>
          )}
        </div>
      </div>
    </div>
  </>;
}