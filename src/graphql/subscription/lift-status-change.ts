import { gql } from '@apollo/client';

export const LIFT_STATUS_CHANGE = gql`
  subscription LiftStatusChange {
    liftStatusChange {
      id
      name
      status
    }
  }
`;
