import { useNavigate } from "react-router-dom";

export const SearchResultsList = ({ results }) => {
  const navigate = useNavigate();

  const handleResultClick = (userId) => {
    navigate("/otherprofile", { state: { userId } }); // Pass userId using state object
  };

  return (
    <div className="w-full bg-transparent flex flex-col shadow-lg rounded-lg max-h-80 overflow-y-auto scrollbar-thin">
      {results.map((user, id) => {
        return (
          <li
            key={id}
            className="flex items-center pl-2 hover:bg-[#131313]"
            onClick={() => handleResultClick(user.user_id)}
          >
            <img
              className="size-14 rounded-full border-none"
              src={user.profile_path || "./siteimage/no.png"}
              alt={`Avatar of ${user.username}`}
            />
            <div className="flex-1 text-white cursor-pointer">
              <div className="text-base ">{user.username}</div>
              <div className="text-xs">{user.full_name}</div>
            </div>
          </li>
        );
      })}
    </div>
  );
};
