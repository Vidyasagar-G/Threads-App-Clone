import { Button, Text } from '@chakra-ui/react'
import useShowToast from '../hooks/useShowToast'
import useLogout from '../hooks/useLogout';

const SettingsPage = () => {
  const showToast = useShowToast();
  const logout = useLogout();

  const freezeAccount = async () => {
    if(!window.confirm("Are you sure you want to freeze your account?")) return;

    try {
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      if(data.success){
        await logout();
        showToast("Success", "Account frozen successfully", "success");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
      return;
    }
  }

  return <>
    <Text my={1}>Freeze your account</Text>
    <Text my={1}>You can unfreeze your account anytime by logging in.</Text>
    <Button size={"sm"} colorScheme='red' onClick={freezeAccount}>
      Freeze
    </Button>
  </>
}

export default SettingsPage
