import { Box, Container, Paper, Title, Text, Anchor, TextInput, PasswordInput, Button } from '@mantine/core';
import styles from './signup.module.css';
import { useRouter } from 'next/router';
import { Links } from '@/components/Navbar/Navbar';
import { isNotEmpty, useForm } from '@mantine/form';
import { SignupDto, authApi } from '@/api/authApi';
import { useState } from 'react';
import { RequestStatus } from '@/api/request-status.enum';

export default function Signup() {
  const router = useRouter();
  const form = useForm<SignupDto>({
    initialValues: {
      email: '',
      password: '',
      userName: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      userName: isNotEmpty('Enter your userName '),
      password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const [isLoading, setIsLoading] = useState(RequestStatus.NotStated);

  const onSubmit = async (signupDto: SignupDto) => {
    setIsLoading(RequestStatus.InProgress);
    try {
      const registerResponse = await authApi.signup(signupDto);
      console.log(registerResponse);
      router.push(Links.LOGIN);
    } catch (error) {
      setIsLoading(RequestStatus.Failed);
    }
  };

  return (
    <Box className={styles.container}>
      <Container className={styles.boxContainer} size={420} my={40}>
        <Title ta="center" className={styles.title}>
          Welcome!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do you have an account?{' '}
          <Anchor onClick={() => router.push(Links.LOGIN)} size="sm" component="button">
            Login here
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} className={styles.formContainer} radius="md">
          <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput
              {...form.getInputProps('email')}
              label="Email"
              placeholder="you@gmail.dev"
              required
            />
            <TextInput
              {...form.getInputProps('userName')}
              label="UserName"
              placeholder="Lol"
              required
              mt="md"
            />
            <PasswordInput
              {...form.getInputProps('password')}
              label="Password"
              placeholder="Your password"
              required
              mt="md"
            />

            <Button
              type="submit"
              loading={isLoading === RequestStatus.InProgress}
              fullWidth
              mt="xl"
            >
              Sign up
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
