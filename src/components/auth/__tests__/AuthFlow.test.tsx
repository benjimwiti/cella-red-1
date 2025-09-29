import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthFlow from '../AuthFlow';
import * as useAuthHook from '@/hooks/useAuth';

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('AuthFlow Component', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders EmailStep and proceeds through the flow for login', async () => {
    // Mock useAuth hook
    const sendOTPMock = vi.fn().mockResolvedValue({ error: null });
    const signInMock = vi.fn().mockResolvedValue({ error: null });

    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      sendOTP: sendOTPMock,
      signIn: signInMock,
      signOut: vi.fn(),
      signUp: vi.fn(),
      user: null,
      session: null,
      loading: false,
    });

    render(<AuthFlow onComplete={mockOnComplete} isLogin={true} />);

    // EmailStep should be rendered
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    // Enter email and submit
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send login code/i }));

    await waitFor(() => {
      expect(sendOTPMock).toHaveBeenCalledWith('test@example.com');
    });

    // VerificationStep should be rendered
    expect(screen.getByText(/check your email/i)).toBeInTheDocument();

    // Enter OTP code and submit
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: '1' } });
    });

    fireEvent.click(screen.getByRole('button', { name: /verify & continue/i }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalled();
    });

    // Success step should be rendered
    expect(screen.getByText(/welcome to cella/i)).toBeInTheDocument();

    // Click Get Started button
    fireEvent.click(screen.getByRole('button', { name: /get started/i }));

    expect(mockOnComplete).toHaveBeenCalled();
  });

  test('renders EmailStep and proceeds through the flow for signup', async () => {
    const sendOTPMock = vi.fn().mockResolvedValue({ error: null });
    const signUpMock = vi.fn().mockResolvedValue({ error: null });

    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      sendOTP: sendOTPMock,
      signUp: signUpMock,
      signIn: vi.fn(),
      signOut: vi.fn(),
      user: null,
      session: null,
      loading: false,
    });

    render(<AuthFlow onComplete={mockOnComplete} isLogin={false} />);

    // EmailStep should be rendered
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    // Enter email and submit
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'signup@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(sendOTPMock).toHaveBeenCalledWith('signup@example.com');
    });

    // VerificationStep should be rendered
    expect(screen.getByText(/check your email/i)).toBeInTheDocument();

    // Enter OTP code and submit
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: '1' } });
    });

    fireEvent.click(screen.getByRole('button', { name: /verify & continue/i }));

    // ProfileSetupStep should be rendered
    expect(screen.getByText(/complete your profile/i)).toBeInTheDocument();

    // Fill profile form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.click(screen.getByRole('button', { name: /female/i }));

    // Date picker and other inputs can be tested similarly if needed

    fireEvent.click(screen.getByRole('button', { name: /complete setup/i }));

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });
});
