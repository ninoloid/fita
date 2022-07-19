import { gql } from 'apollo-server-lambda';

// Inputs
import CartInput from './inputs/CartInput';
import AddToCartResponseObject from './objects/AddToCartResponseObject';
// Objects
import ProductObject from './objects/ProductObject';
// Root types
import Mutation from './root/Mutation'; // tslint:disable-line ordered-imports
import Query from './root/Query'; // tslint:disable-line ordered-imports

const typeDefStrings = [
  // Inputs
  CartInput,
  // Objects
  ProductObject,
  AddToCartResponseObject,
  // Root types
  Mutation,
  Query,
];

const typeDefs = typeDefStrings.map(typeDef => gql(typeDef));

export default typeDefs;
