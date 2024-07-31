import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react"
import SuggestedUser from "./SuggestedUser"
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = () => {
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    if (loading) return;
    setLoading(true);
    const getSuggestedUsers = async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setSuggestedUsers(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    }

    getSuggestedUsers()

  }
  , [showToast])

  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Suggested Users
      </Text>
      <Flex direction={"column"} gap={4}>
        {!loading && suggestedUsers.map(user=> 
          <SuggestedUser key={user._id} user={user} />)}
        {loading && [0, 1, 2, 3, 4].map((_, idx) => (
          <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
            <Box>
              <SkeletonCircle size={"10"} />
            </Box>
            <Flex flexDirection={"column"} gap={2} w={"full"}>
              <Skeleton h={"8px"} w={"80px"} />
              <Skeleton h={"8px"} w={"90px"} />
            </Flex>
            <Flex>
              <Skeleton h={"20px"} w={"60px"} />
            </Flex>
          </Flex>
        ))}
      </Flex>
    </>
  )
}

export default SuggestedUsers



// Loading skeleton for SuggestedUser component

/*
  <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
            <Box>
              <SkeletonCircle size={"10"} />
            </Box>
            <Flex flexDirection={"column"} gap={2} w={"full"}>
              <Skeleton h={"8px"} w={"80px"} />
              <Skeleton h={"8px"} w={"90px"} />
            </Flex>
            <Flex>
              <Skeleton h={"20px"} w={"60px"} />
            </Flex>
          </Flex>
        ))}
*/
