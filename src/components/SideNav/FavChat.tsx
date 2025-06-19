import { StarIcon } from "assets/icons/StarIcon";
import { StarIconSolid } from "assets/icons/StarIconSolid";
import { useAppStoreUpdateChatFav } from "store/useAppStore";

type Props = {
  id: string;
  fav: boolean;
};

export const FavChat = ({ id, fav }: Props) => {
  const updateChatFav = useAppStoreUpdateChatFav();

  const toggleFav = () => {
    updateChatFav(id, !fav);
  };

  return (
    <>
      {fav ? (
        <StarIconSolid
          className="size-5 mt-2 cursor-pointer"
          onClick={toggleFav}
        />
      ) : (
        <StarIcon className="size-5 mt-2 cursor-pointer" onClick={toggleFav} />
      )}
    </>
  );
};
