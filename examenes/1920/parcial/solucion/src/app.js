import { GraphQLServer } from "graphql-yoga";
import { getFilmsInfo } from "./utils";
import { fetchData } from "./fetchData";

const runApp = function(peopleData, filmsData) {
  const typeDefs = `
    type Query {
      people(page: Int, number: Int, name: String, gender: String): PeopleReturn!
      character(id: Int!):Character
    }

    type PeopleReturn {
      page: Int!
      totalPages: Int!
      totalPeople: Int!
      people: [Character!]
    }

    type Character {
      name: String!
      gender: String!
      url: String!
      id: Int!
      films: [Film!]
    }

    type Film {
      title: String!
      episode: String!
      url: String!
    }
  `;

  const resolvers = {
    Query: {
      people: (parent, args, ctx, info) => {
        const page = args.page || 1;
        const number = args.number || 10;

        const init = (page - 1) * number;
        const end = init + number;

        let result = peopleData.slice();

        if (args.name) {
          result = result.filter(obj =>
            obj.name.toUpperCase().includes(args.name.toUpperCase())
          );
        }

        if (args.gender) {
          result = result.filter(
            obj => obj.gender.toUpperCase() === args.gender.toUpperCase()
          );
        }

        const people = result.slice(init, end).map((character, index) => {
          return {
            name: character.name,
            gender: character.gender,
            url: character.url,
            id: index,
            films: getFilmsInfo(character.films, filmsData)
          };
        });

        return {
          totalPeople: peopleData.length,
          totalPages: Math.ceil(peopleData.length / number),
          page,
          people
        };
      },

      character: (parent, args, ctx, info) => {
        const char = peopleData[args.id];
        return {
          name: char.name,
          gender: char.gender,
          url: char.url,
          id: args.id,
          films: getFilmsInfo(char.films, filmsData)
        };
      }
    }
  };

  const server = new GraphQLServer({ typeDefs, resolvers });

  const options = {
    port: 4000
  };

  server.start(options, ({ port }) =>
    console.log(
      `Server started, listening on port ${port} for incoming requests.`
    )
  );
};

// Fetch Data and then run app
fetchData(runApp);
