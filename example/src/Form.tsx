import React from 'react';
import { usePreservedForm } from 'use-preserved-form';

type FormData = {
  name: string;
  lastName: string;
};

export const Form: React.FC = (props) => {
  const form = usePreservedForm<FormData>('mainForm');

  const onSubmit = (data: FormData) => {
    form.reset();
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} onReset={() => form.reset()}>
        <div>
          Name:
          <input name="name" ref={form.register} />
        </div>
        <div>
          LastName:
          <input name="lastName" ref={form.register} />
        </div>
        <div>
          <input type="submit" value="Submit" />
          <input type="reset" value="Reset" />
        </div>
      </form>
    </div>
  );
};
