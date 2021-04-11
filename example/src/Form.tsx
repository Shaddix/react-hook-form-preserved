import React from 'react';
import { usePreservedForm } from 'react-hook-form-preserved';

type FormData = {
  name: string;
  lastName: string;
};

export const Form: React.FC = (props) => {
  const form = usePreservedForm<FormData>('mainForm');
  const onSubmit = (data: FormData) => {
    form.reset({});
    console.log(data);
  };
  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={() => form.reset({})}
      >
        <div>
          Name:
          <input {...form.register('name')} />
        </div>
        <div>
          LastName:
          <input {...form.register('lastName')} />
        </div>
        <div>
          <input type="submit" value="Submit" />
          <input type="reset" value="Reset" />
        </div>
      </form>
      <p>Fill in the form and click F5 (to simulate browser crash/closing).</p>
      <p>You will see that the values you entered are preserved.</p>
      <p>
        Then you could submit/reset the form and make sure that values are not
        saved anymore (after F5).
      </p>
    </div>
  );
};
