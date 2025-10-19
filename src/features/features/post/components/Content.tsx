import { useNavigate } from 'react-router-dom';

interface ContentProps {
  id: number,
  caption: string,
  image_url: string,
  is_detail?: boolean
  data?: any
}

export default function Content(props: ContentProps) {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <img className="rounded-t-lg" src={props.image_url} alt="" />
        </a>
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {props.caption}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology
            acquisitions of 2021 so far, in reverse chronological order.</p>

          {!props.is_detail && (
            <button onClick={() => navigate(`${props.id}`)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Read more
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </button>
          )}

          {props.is_detail && (
            <>
              <p>Posted By: {props.data.user.name}</p>
              <p>Like: {props.data.likes.length}</p>
              <p>Comment: {props.data.comments.length}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}