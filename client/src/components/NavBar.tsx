import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: isFetchingLogout }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(), //do not run query if on server
  });

  if (fetching) {
    return null;
  }

  return (
    <Flex position="sticky" top={0} zIndex={1} bg="tan" p={4}>
      <Box ml={"auto"}>
        {!data?.me ? (
          <>
            <NextLink href="/login">
              <Link mr={2}>Login</Link>
            </NextLink>
            <NextLink href="/register">
              <Link>Register</Link>
            </NextLink>
          </>
        ) : (
          <Flex>
            <Box mr={2}>{data.me.username}</Box>
            <Button
              isLoading={isFetchingLogout}
              onClick={() => logout()}
              variant="link"
            >
              Logout
            </Button>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
