import ContentLoader from "@/components/content-loader";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardContent, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useService } from "@/hooks/use-service";
import { postSchema, type ApiError, type Post, type PostValues } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function PostsPage() {
  const service = useService<Post>("/posts");
  const queryClient = useQueryClient();
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => service.getAll(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const handleRemove = (id: string) => {
    service.remove(id).then(() => {
      toast.success("Post excluído com sucesso");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }).catch((error: AxiosError<ApiError>) => {
      toast.error("Erro ao excluir post", {
        description: error.response?.data.message || "Erro ao excluir post",
      });
    });
  };

  const handleCreate = async (data: PostValues) => {
    await service.create({
      title: data.title,
      content: data.content,
    }).then(() => {
      toast.success("Post criado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      form.reset();
    }).catch((error: AxiosError<ApiError>) => {
      toast.error("Erro ao criar post", {
        description: error.response?.data.message || "Erro ao criar post",
      });
    });
  };
  return (
  <>
  <ContentLoader loading={isLoading} error={error} noContent="Nenhum post encontrado">
    {posts && posts.map((post) => (
      <Card key={post.id} className="mb-4">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{post.content}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link to={`/posts/${post.id}`}>Editar</Link>
          </Button>
          <Button variant="destructive" onClick={() => handleRemove(post.id)}>
            Excluir
          </Button>
        </CardFooter>
      </Card>
    ))}
  </ContentLoader>
  <Dialog>
    <DialogTrigger asChild>
      <Button>Novo post</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo post</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Preencha os campos abaixo para criar um novo post.
      </DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Título do post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conteúdo</FormLabel>
                <FormControl>
                  <Textarea placeholder="Conteúdo do post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Salvar</Button>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
  </>);
}
