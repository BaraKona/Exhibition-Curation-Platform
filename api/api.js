import axios from "axios";
import { parsingClevData, parsingVAData } from "../src/Utils/api_util";

const VAAPI = axios.create({
  baseURL: `https://api.vam.ac.uk/v2/objects/search?`,
});
const clevAPI = axios.create({
  baseURL: `https://openaccess-api.clevelandart.org/api/artworks/`,
});

export const getOneClevArt = (id) => {
  return clevAPI
    .get(`${id}`)
    .then((response) => {
      console.log(response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.error("Error fetching artworks:", error);
      throw error;
    });
};

export const getOneVAArt = (id) => {
  return VAAPI.get(`q=${id}&images_exist=true`)
    .then((response) => {
      return response.data.records[0];
    })
    .catch((error) => {
      console.error("Error fetching artworks:", error);
      throw error;
    });
};

export const VAArtworkCollection = (terms) => {
  let VAQuery = `?page_size=100&images_exist=true&q=*`;
  terms.type ? (VAQuery += `&q_object_type=${terms.type}`) : null;
  terms.page && terms.page % 25 === 0
    ? (VAQuery += `&page=${page / 25 + 1}`)
    : null;

  return VAAPI.get(VAQuery)
    .then((response) => {
      return response.data.records.map((item) => {
        return parsingVAData(item);
      });
    })
    .catch((error) => {
      console.error("Error fetching artworks:", error);
      throw error;
    });
};

export const clevelandArtworkCollection = (terms) => {
  let clevelandQuery = "?q=1&has_image=1&limit=100";
  terms.type ? (clevelandQuery += `&classification_type=${terms.type}`) : null;
  console.log(clevelandQuery);
  return clevAPI
    .get(clevelandQuery)
    .then((response) => {
      return response.data.data.map((item) => {
        return parsingClevData(item);
      });
    })
    .catch((error) => {
      console.error("Error fetching artworks:", error);
      throw error;
    });
};

export const combinedArtwork = (terms, selectedCategories, selectedMuseums) => {
  console.log(selectedCategories, selectedMuseums);
  const parsedData = [];
  let clevelandPromise = Promise.resolve({ data: { data: [] } });
  if (terms.toggleCleveland) {
    let clevelandQuery = "?q=1&has_image=1&limit=100";
    if (terms.type) clevelandQuery += `&classification_type=${terms.type}`;
    clevelandPromise = clevAPI.get(clevelandQuery).catch((error) => {
      console.error("Cleveland API Error:", error);
      return { data: { data: [] } };
    });
  }

  let VAPromise = Promise.resolve({ data: { records: [] } });
  if (terms.toggleVA) {
    let VAQuery = `?page_size=100&images_exist=true&q=*`;
    if (terms.type) VAQuery += `&q_object_type=${terms.type}`;
    if (terms.page && terms.page % 25 === 0)
      VAQuery += `&page=${terms.page / 25 + 1}`;
    VAPromise = VAAPI.get(VAQuery).catch((error) => {
      console.error("VA API Error:", error);
      return { data: { records: [] } };
    });
  }

  return Promise.all([clevelandPromise, VAPromise]).then((res) => {
    if (terms.toggleCleveland) {
      res[0].data.data.forEach((element) => {
        parsedData.push(parsingClevData(element));
      });
    }

    if (terms.toggleVA) {
      res[1].data.records.forEach((element) => {
        parsedData.push(parsingVAData(element));
      });
    }

    return parsedData;
  });
};
