import axios from 'axios';
import CircuitBreaker from 'opossum';
import config from '../../../config';
// eslint-disable-next-line import/no-cycle
import starshipDataLoader from '../../../graphQL/dataLoaders/starship.dataLoader';
import GraphQLStarship from '../../../graphQL/types/GraphQLStarship.type';
import meter from '../../../log/utils/meter';
import formatStarship from './formatStarship';

const fetchStarshipByID = async (id: string): Promise<GraphQLStarship | null> => {
  const { data: swapiStarship } = await axios.get(`${config.swapiURL}/api/starships/${id}/`);
  return formatStarship(id, swapiStarship);
};

const breaker = new CircuitBreaker(fetchStarshipByID, {
  timeout: 3000, // If our function takes longer than 3s, trigger a failure.
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit.
  resetTimeout: 5000, // After 5s, try again.
});

const starshipBeakerCounter = meter.createCounter('starshipBeakerCounter');

breaker.eventNames().forEach((eventName) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  breaker.on(eventName, () => {
    const labels = { breakerName: breaker.name, eventName: String(eventName) };
    starshipBeakerCounter.bind(labels).add(1);
  });
});

const fetchStarshipByIDWithBreaker = async (id: string): Promise<GraphQLStarship | null> => {
  return breaker
    .fire(id)
    .then((res) => res)
    .catch((err) => {
      starshipDataLoader.clear(id);
      return err;
    });
};

export default fetchStarshipByIDWithBreaker;
