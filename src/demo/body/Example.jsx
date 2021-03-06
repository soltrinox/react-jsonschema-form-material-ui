/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable max-len */
/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import { useTheme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import useStyles from './example-styles';
import Source from './Source';
import Form from '../../Form';

// Custom Components
import CustomRating from './custom-components/rating.component';
import CustomComponent from './custom-components/range-picker.component';

const FormComponent = ({
  locationHash,
  givenSchema,
  givenUISchema,
  givenFormData,
  givenUIData,
  onCancel,
  onSubmit,
  onUpload,
  onFormChanged,
  onError,
}) => (
		<Form
			schema={givenSchema}
			uiSchema={givenUISchema}
      formData={givenFormData}
			onCancel={onCancel}
			onSubmit={onSubmit}
			onUpload={onUpload}
      onChange={onFormChanged}
      onError={onError}
      interceptors={{
        translateRatings: (givenData, uiData) => ({ givenData, uiData }),
      }}
			components={{
			  customComponent: ({ onChange, ...rest }) => (
					<CustomComponent onChange={onChange} formData={givenFormData} uiData={givenUIData} {...rest} />
			  ),
			  customRating: ({ onChange, ...rest }) => (
					<CustomRating onChange={onChange} formData={givenFormData} uiData={givenUIData} {...rest} />
			  ),
			}}
      validations={{
        confirmPassword: ({ schema, validations, formData, value }) => value !== formData.pass1 && ({
          message: validations.confirmPassword.message,
          inline: true,
        }),
      }}
			submitOnEnter
			activityIndicatorEnabled
		/>
);

const SourceSchema = ({
  locationHash,
  classes,
  validSchema,
  schema,
  uiSchema,
  formData,
  onChange,
  hasSchemaError,
  showStuff,
}) => (
    <div className={classes.sourceCtr}>
      <div>
        <Source key={`${locationHash}Schema`} title={'JSONSchema.json'} source={schema} onChange={onChange('schema')} />
      </div>
      <div>
        <Source key={`${locationHash}UISchema`}  title={'uiSchema.json'} source={uiSchema} onChange={onChange('uiSchema')} />
        <Source key={`${locationHash}FormData`}  title={'formData.json'} schema={validSchema} hasSchemaError={hasSchemaError} source={formData} onChange={onChange('formData')} />
      </div>
    </div>
);

const Example = ({
  data
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [oldHash, setOldHash] = useState(window.location.hash);
  const [state, setState] = useState({ ...data });
  const [schemaErrors, setSchemaErrors] = useState(null);
  const [validSchema, setValidSchema] = useState(null);

  if (!isEqual(oldHash, window.location.hash)) {
    setState(data);
    setValidSchema(null);
    setSchemaErrors(null);
    setOldHash(window.location.hash);
  }

  const onChange = (type) => (value) => {
    setState({ ...state, [type]: value  });
  }

  const onFormChanged = ({ formData, uiSchema, uiData, schemaErrors, validSchema: givenValidSchema }) => {
    setState({ ...state, formData, uiSchema, uiData, validSchema });
    setSchemaErrors(schemaErrors);
    setValidSchema(givenValidSchema);
  }

  const onSubmit = (value, callback) => {
    console.log('onSubmit: %s', JSON.stringify(value)); // eslint-disable-line no-console
    setTimeout(() => callback && callback(), 2000);
  }

  const onUpload = (value) => {
    console.log('onUpload:', value); // eslint-disable-line no-console
  }

  const onFormError = (error = {}) => {
    console.log('error is', error);
  }

  const onCancel = () => {
    setState({
      ...data,
    });
  };

  const { formData, uiSchema, schema, title, uiData } = state;

  const hash = window.location.hash.replace('#', '');
  const oldHashs = oldHash.replace('#', '');

  if(!isEqual(oldHashs, hash)) {
    return (
        <div> Loading... </div>
    );
  }

  const editorSchema = [{
    uri: 'http://json-schema.org/draft-07/schema',
    fileMatch: ['JSONSchema.json'],
    schema: undefined,
  },
  {
    uri: 'http://json-schema.org/draft-07/schema',
    fileMatch: ['uiSchema.json'],
    schema: undefined,
  },{
    uri: `${window.location.origin}/schema/${hash}/schema.json`,
    fileMatch: ['formData.json'],
    schema: validSchema || data.schema,
  }];
  
  return (
    <Paper className={classes.root}>
      <h3>{title}</h3>
      <div className={classes.ctr}>
        <SourceSchema 
          locationHash={hash}
          classes={classes}
          schema={schema || data.schema}
          validSchema={editorSchema || data.schema}
          uiSchema={uiSchema || data.uiSchema}
          formData={formData || data.formData}
          hasSchemaError={schemaErrors}
          onChange={onChange}
        />
        <div className={classes.display}>
          <FormComponent
            locationHash={hash}
            givenSchema={schema || data.schema}
            givenUISchema={uiSchema || data.uiSchema}
            givenFormData={formData || data.formData}
            givenUIData={uiData}
            onCancel={onCancel}
            onSubmit={onSubmit}
            onUpload={onUpload}
            onFormChanged={onFormChanged}
            onError={onFormError}
          />
        </div>
      </div>
    </Paper>
  );
}

export default Example;
