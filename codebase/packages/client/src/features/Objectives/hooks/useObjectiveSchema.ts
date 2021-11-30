import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getObjectiveSchema } from '@pma/store/src/selectors/schema';
import { SchemaActions } from '@pma/store';

function useObjectivesSchema() {
  const dispatch = useDispatch();
  const schema = useSelector(getObjectiveSchema);
  const { components = [] } = useSelector(getObjectiveSchema);

  const getSchema = useCallback(() => {
    if (!components?.length) {
      dispatch(SchemaActions.getSchema());
    }
  }, [components]);

  useEffect(() => {
    getSchema();
  }, []);

  return [schema, getSchema];
}

export default useObjectivesSchema;