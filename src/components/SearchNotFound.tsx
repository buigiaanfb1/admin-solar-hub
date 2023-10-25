import { Paper, PaperProps, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

interface SearchNotFoundProps extends PaperProps {
  searchQuery?: string;
}

export default function SearchNotFound({ searchQuery = '', ...other }: SearchNotFoundProps) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Không tìm thấy
      </Typography>
      <Typography variant="body2" align="center">
        Không tìm thấy kết quả cho tìm kiếm &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Kiếm tra chính tả và thử lại.
      </Typography>
    </Paper>
  );
}
