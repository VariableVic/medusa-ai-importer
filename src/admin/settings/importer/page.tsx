import type { SettingConfig, SettingProps } from "@medusajs/admin";
import { AdminPostProductsReq } from "@medusajs/medusa";
import {
  Button,
  Container,
  Heading,
  Select,
  Text,
  Textarea,
} from "@medusajs/ui";
import { ChatRequest, Message, ToolCall, ToolCallHandler, nanoid } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";

import ProductList from "../../components/product-list";

const backendUrl =
  process.env.MEDUSA_BACKEND_URL === "/"
    ? location.origin
    : process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";

const AiImporter = ({ notify }: SettingProps) => {
  const [type, setType] = useState<string>("Product");
  const [products, setProducts] = useState<AdminPostProductsReq[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);

  // Formats the response from the tool calls
  const formatToolResponse = (
    toolCallId: string,
    content: Record<string, any>,
    chatMessages: Message[],
    name: string
  ): ChatRequest => {
    return {
      messages: [
        ...chatMessages,
        {
          id: nanoid(),
          tool_call_id: toolCallId,
          name,
          role: "function" as const,
          content: JSON.stringify(content),
        },
      ],
    };
  };

  // Handle tool calls from GPT
  const toolCallHandler: ToolCallHandler = async (chatMessages, toolCalls) => {
    // Handle propose_product tool call
    toolCalls.forEach((toolCall) => {
      if (toolCall.function.name === "propose_products") {
        const parsedFunctionCallArguments = JSON.parse(
          toolCall.function.arguments
        );
        let content: Record<string, any> = { error: "No arguments provided" };

        if (!parsedFunctionCallArguments.products) {
          content = {
            error: "No products provided. Ask the user to provide products.",
          };
        }

        if (parsedFunctionCallArguments.products) {
          content = {
            product_proposed:
              "Product creation proposal sent to the agent. They can now create the product by clicking the button in list above.",
          };
        }

        return formatToolResponse(
          toolCall.id,
          content,
          chatMessages,
          "propose_products"
        );
      }
    });
  };

  // Hook to get completion from AI
  const { isLoading, input, handleInputChange, handleSubmit } = useChat({
    api: `${backendUrl}/admin/import`,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: {
      type: type.toLowerCase(),
    },
    experimental_onToolCall: toolCallHandler,
    onFinish: (message) => {
      try {
        console.log("Message", message);
        setProducts((prev) => [...prev, ...parseProducts(message)]);
      } catch (e) {
        console.error(e);
      }
    },
  });

  // Sometimes GPT returns a string, sometimes an object, so we need to handle both cases
  const parseProducts = (inputMessage: Message): AdminPostProductsReq[] => {
    try {
      if (typeof inputMessage.content === "string") {
        const content = JSON.parse(inputMessage.content);
        const { message, finish_reason } = content.choices[0];
        if (finish_reason === "length") {
          notify.error(
            "Error",
            "The input data is too long. Please try with a shorter input."
          );
          return [];
        }
        const parsedFunctionCallArguments = JSON.parse(
          (message?.tool_calls?.[0] as ToolCall)?.function?.arguments
        );
        return parsedFunctionCallArguments?.products;
      }

      const toolCalls = inputMessage.tool_calls as ToolCall[];
      const parsedFunctionCallArguments = JSON.parse(
        toolCalls[0].function.arguments
      );
      return parsedFunctionCallArguments?.products;
    } catch (e) {
      throw new Error(e);
    }
  };

  const loadingMessages = [
    "Importing",
    "Recognizing products",
    "Collecting product images",
    "Looking for product variants",
    "Calculating prices",
    "Hang tight, almost there",
    "Wow, that's a lot of products!",
    "Finishing up",
  ];

  useEffect(() => {
    let timerId;

    if (isLoading) {
      for (let i = 0; i < loadingMessages.length; i++) {
        timerId = setTimeout(() => {
          setMessageIndex(i);
        }, i * 5000);
      }
    }

    return () => clearTimeout(timerId);
  }, [isLoading, loadingMessages.length]);

  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="overflow-hidden p-px">
      <Container className="p-8 flex flex-col gap-y-4 mb-4">
        <h1 className="text-grey-90 inter-xlarge-semibold">AI Importer</h1>
        <Text className="text-grey-50 flex flex-row gap-2">
          The AI Importer lets you import any data from raw text or JSON files.
        </Text>

        {products?.length > 0 && (
          <ProductList products={products} notify={notify} />
        )}

        <form
          onSubmit={handleFormSubmit}
          className="w-full flex flex-col gap-y-4"
        >
          <Heading>Paste raw data below:</Heading>
          <div className="flex-1">
            <Textarea
              className="bg-gray-50 whitespace-pre-wrap h-40"
              onChange={handleInputChange}
              value={input}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-stretch gap-4 w-full">
            <Select onValueChange={(value) => setType(value)} value={type}>
              <Select.Trigger>
                <Select.Value placeholder="Select a data type" />
              </Select.Trigger>
              <Select.Content>
                {["Product", "Category", "Type"].map((item) => {
                  return (
                    <Select.Item key={item} value={item}>
                      {item}
                    </Select.Item>
                  );
                })}
              </Select.Content>
            </Select>
            <Button
              disabled={isLoading}
              type="submit"
              className="w-max min-w-max"
            >
              {isLoading ? loadingMessages[messageIndex] : "Import"}
              {isLoading && (
                <div className="flex flex-row gap-1 ml-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-75">.</span>
                  <span className="animate-bounce delay-150">.</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export const config: SettingConfig = {
  card: {
    label: "AI Importer",
    description: "Import any data from raw text or JSON files.",
  },
};

export default AiImporter;
