
import { uploadFileS3 } from '@/actions';
import { User } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';


export const handleS3FileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    user: User
  ) => {
    console.log('event', event);
    try {

      if (event.target.files) {
        const file = event.target.files[0];
        const data = new FormData();
        data.append('file', file);

        const fileId = nanoid();

        const response = await uploadFileS3({
          key: `${user.id}/1/${fileId}`,
          content: data,
        });

        if (response.ok) {
          return fileId;
        } else {
          console.log('There be an error');
        }
      }
    } catch (error) {
      console.error('An error occurred');
    } finally {
    }
  };