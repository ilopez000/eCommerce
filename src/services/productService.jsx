import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const fetchProducts = async () => {
  const productsCollection = collection(db, "Products");
  const productSnapshot = await getDocs(productsCollection);
  const productList = productSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return productList;
};
