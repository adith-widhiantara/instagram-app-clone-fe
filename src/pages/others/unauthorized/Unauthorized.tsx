import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="h-screen lg:p-8">
      <div className="flex items-center text-lg font-medium" data-testid="logo"></div>
      <div className="flex h-full justify-center pt-20">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold" data-testid="title">
            Unauthorize
          </h1>
          <p data-testid="message">Sorry for the inconvenience, please contact the administrator</p>
          <Link className=" text-blue-alurkerja" to="/">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
