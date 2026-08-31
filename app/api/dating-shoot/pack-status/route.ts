import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { creditService } from '@/lib/credits';
import { packsFromCredits, SHOOT_CREDIT_COST } from '@/lib/dating/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { balance = 0, error: creditError } =
      await creditService.getUserCredits(user.id);

    if (creditError) {
      return NextResponse.json(
        { error: 'Failed to fetch credits' },
        { status: 500 }
      );
    }

    const userPacks = packsFromCredits(balance);
    const hasPack = userPacks >= 1;

    return NextResponse.json({
      hasPack,
      packs: userPacks,
      balance,
      shootCreditCost: SHOOT_CREDIT_COST,
    });
  } catch (error) {
    console.error('Error fetching pack status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
